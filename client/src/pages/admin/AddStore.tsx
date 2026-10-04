import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  createAdminStore,
  getAdminUsers,
  type AdminUser,
} from "@/services/adminService";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, "Store name must be at least 20 characters")
    .max(60, "Store name must not exceed 60 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(400, "Address must not exceed 400 characters"),

  ownerId: z.string().min(1, "Please select a store owner"),
});

type FormValues = z.infer<typeof formSchema>;

function AddStore() {
  const navigate = useNavigate();

  const [owners, setOwners] = useState<AdminUser[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(true);
  const [ownersError, setOwnersError] = useState("");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      ownerId: "",
    },
  });

  const ownerId = watch("ownerId");

  useEffect(() => {
    const loadOwners = async () => {
      try {
        setOwnersLoading(true);
        setOwnersError("");

        const data = await getAdminUsers({
          role: "OWNER",
        });

        setOwners(data.users);
      } catch {
        setOwnersError("Unable to load store owners.");
      } finally {
        setOwnersLoading(false);
      }
    };

    loadOwners();
  }, []);

  const onSubmit = async (values: FormValues) => {
    try {
      setServerError("");

      await createAdminStore(values);

      navigate("/admin/stores");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          "Unable to create store. Please try again.",
      );
    }
  };

  return (
    <DashboardLayout
      title="Add Store"
      description="Create a store and assign it to an existing store owner."
      role="ADMIN"
    >
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create Store</CardTitle>
          </CardHeader>

          <CardContent>
            {serverError && (
              <div className="mb-6 rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Store name
                </label>

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
                <label htmlFor="email" className="text-sm font-medium">
                  Store email
                </label>

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
                <label htmlFor="address" className="text-sm font-medium">
                  Address
                </label>

                <Input
                  id="address"
                  placeholder="Enter store address"
                  {...register("address")}
                />

                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Store owner</label>

                {ownersLoading ? (
                  <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
                    Loading store owners...
                  </div>
                ) : owners.length === 0 ? (
                  <div className="rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive">
                    No store owners are available. Create an OWNER account
                    first.
                  </div>
                ) : (
                  <Select
                    value={ownerId}
                    onValueChange={(value) => {
                      if (value) {
                        setValue("ownerId", value, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store owner" />
                    </SelectTrigger>

                    <SelectContent>
                      {owners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.name} — {owner.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {ownersError && (
                  <p className="text-sm text-destructive">{ownersError}</p>
                )}

                {errors.ownerId && (
                  <p className="text-sm text-destructive">
                    {errors.ownerId.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/stores")}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={isSubmitting || owners.length === 0}
                >
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
