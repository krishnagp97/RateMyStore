import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Store as StoreIcon } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createStore } from "@/services/storeService";

const storeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, "Store name must be at least 20 characters")
    .max(60, "Store name must not exceed 60 characters"),

  email: z.string().trim().email("Enter a valid email address"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(400, "Address must not exceed 400 characters"),
});

type StoreFormData = z.infer<typeof storeSchema>;

function AddStore() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
  });

  const onSubmit = async (data: StoreFormData) => {
    try {
      await createStore(data);
      navigate("/owner", { replace: true });
    } catch (error: any) {
      setError("root", {
        message: error?.response?.data?.message || "Failed to create store",
      });
    }
  };

  return (
    <DashboardLayout
      title="Add Store"
      description="Add a new store to your account."
      role="OWNER"
    >
      <div className="mx-auto max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md border bg-muted">
                <StoreIcon className="size-5" />
              </div>

              <CardTitle>Store Details</CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Store Name</Label>
                <Input
                  id="name"
                  placeholder="Enter store name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Store Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="store@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Store Address</Label>
                <textarea
                  id="address"
                  placeholder="Enter complete store address"
                  rows={4}
                  {...register("address")}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-20 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
                />
                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/owner")}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Store"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AddStore;
