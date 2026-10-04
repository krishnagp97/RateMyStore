import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Store, Star } from "lucide-react";
import { login } from "../services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const data = await login({ email: email.trim(), password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      switch (data.user.role) {
        case "ADMIN":
          navigate("/admin", { replace: true });
          break;

        case "OWNER":
          navigate("/owner", { replace: true });
          break;

        case "USER":
          navigate("/stores", { replace: true });
          break;

        default:
          setError("Your account has an unrecognized role.");
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const response = (
          error as { response?: { data?: { message?: string } } }
        ).response;

        setError(response?.data?.message || "Login failed. Please try again.");
      } else {
        setError("Login failed. Please try again.");
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
              Discover stores.
              <br />
              Share your experience.
            </h1>
            <p className="max-w-sm text-base leading-7 text-primary-foreground/80">
              Sign in to explore stores, share ratings, and make better choices
              with your community.
            </p>
          </div>

          <p className="text-sm text-primary-foreground/70">
            Your experience helps others choose better.
          </p>
        </section>

        <Card className="rounded-none border-0 shadow-none">
          <CardHeader className="space-y-2 px-6 pt-10 sm:px-10">
            <div className="mb-2 flex items-center gap-2 text-primary md:hidden">
              <Store className="size-6" />
              <span className="text-xl font-bold">RateMyStore</span>
            </div>

            <CardTitle className="text-3xl font-bold tracking-tight">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm">
              Enter your credentials to access your account.
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-10 sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                >
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-primary underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default Login;
