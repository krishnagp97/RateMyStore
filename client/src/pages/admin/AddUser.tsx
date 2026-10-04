import { useState } from "react";
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

import { createAdminUser } from "@/services/adminService";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(20, "Name must be at least 20 characters")
    .max(60, "Name must not exceed 60 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(400, "Address must not exceed 400 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(16, "Password must not exceed 16 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),

  role: z.enum(["ADMIN", "USER", "OWNER"]),
});

type FormValues = z.infer<typeof formSchema>;

function AddUser() {
  const navigate = useNavigate();
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
      password: "",
      role: "USER",
    },
  });

  const role = watch("role");

  const onSubmit = async (values: FormValues) => {
    try {
      setServerError("");

      await createAdminUser(values);

      navigate("/admin/users");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message ||
          "Unable to create user. Please try again.",
      );
    }
  };

  return (
    <DashboardLayout
      title="Add User"
      description="Create a new platform user or administrator."
      role="ADMIN"
    >
      <div className="mx-auto max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Create User</CardTitle>
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
                  Full name
                </label>

                <Input
                  id="name"
                  placeholder="Enter full name"
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
                  Email
                </label>

                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
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
                  placeholder="Enter address"
                  {...register("address")}
                />

                {errors.address && (
                  <p className="text-sm text-destructive">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>

                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  {...register("password")}
                />

                {errors.password && (
                  <p className="text-sm text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Role</label>

                <Select
                  value={role}
                  onValueChange={(value) =>
                    setValue("role", value as FormValues["role"], {
                      shouldValidate: true,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="USER">Normal User</SelectItem>
                    <SelectItem value="OWNER">Store Owner</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                  </SelectContent>
                </Select>

                {errors.role && (
                  <p className="text-sm text-destructive">
                    {errors.role.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/users")}
                >
                  Cancel
                </Button>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AddUser;
