
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, Star } from "lucide-react";
import { signup } from "../services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const address = formData.address.trim();
    const password = formData.password;

    if (name.length < 20 || name.length > 60) {
      setError("Name must be between 20 and 60 characters.");
      return;
    }

    if (address.length > 400) {
      setError("Address must not exceed 400 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password)) {
      setError(
        "Password must be 8–16 characters and include an uppercase letter and a special character.",
      );
      return;
    }

    try {
      setLoading(true);

      await signup({ name, email, address, password });

      setSuccess("Account created successfully. Redirecting to login...");

      window.setTimeout(() => navigate("/login"), 1000);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error
      ) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;

        setError(response?.data?.message || "Signup failed. Please try again.");
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-background shadow-xl md:grid-cols-2">
        <section className="hidden flex-col justify-between bg-primary p-10 text-primary-foreground md:flex">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary-foreground/15 p-3">
              <Store className="size-7" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              RateMyStore
            </span>
          </div>

          <div className="space-y-5">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-foreground/15">
              <Star className="size-7" />
            </div>
            <h1 className="text-4xl font-bold leading-tight">
              Your opinion
              <br />
              makes a difference.
            </h1>
            <p className="max-w-sm leading-7 text-primary-foreground/80">
              Join the community to discover stores, share honest ratings,
              and help others make informed decisions.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/70">
            Create your account and get started.
          </p>
        </section>

        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="space-y-2 px-6 pt-8 sm:px-10">
            <div className="mb-2 flex items-center gap-2 text-primary md:hidden">
              <Store className="size-6" />
              <span className="text-xl font-bold">RateMyStore</span>
            </div>

            <CardTitle className="text-3xl font-bold tracking-tight">
              Create an account
            </CardTitle>
            <CardDescription>
              Fill in your details to join RateMyStore.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  minLength={20}
                  maxLength={60}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  20–60 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                  maxLength={400}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 400 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={8}
                  maxLength={16}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  8–16 characters, including an uppercase letter and a special
                  character.
                </p>
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              {success && (
                <p
                  role="status"
                  className="rounded-lg border border-green-600/30 bg-green-600/10 px-3 py-2 text-sm text-green-700"
                >
                  {success}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create account"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Signup;
