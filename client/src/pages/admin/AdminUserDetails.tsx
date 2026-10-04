import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, LoaderCircle, AlertCircle } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAdminUserDetails,
  type AdminUserDetails as UserDetails,
} from "@/services/adminService";

function AdminUserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId) {
      setError("User ID is missing.");
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getAdminUserDetails(userId);
        setData(response);
      } catch {
        setError("Unable to load user details.");
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  return (
    <DashboardLayout
      title="User Details"
      description="View account information and store activity."
      role="ADMIN"
    >
      <div className="space-y-6">
        <button
          type="button"
          onClick={() => navigate("/admin/users")}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to users
        </button>

        {loading ? (
          <Card>
            <CardContent className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Loading user details…
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive/40">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="mt-0.5 size-5 text-destructive" />
              <div>
                <p className="font-medium">Unable to load user</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : data ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>

              <CardContent>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="mt-1 font-medium">{data.user.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="mt-1 font-medium">{data.user.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="mt-1 font-medium">
                      {data.user.address || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="mt-1 font-medium">{data.user.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {data.user.role === "OWNER" && (
              <Card>
                <CardHeader>
                  <CardTitle>Owned Stores</CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  {!data.stores || data.stores.length === 0 ? (
                    <div className="p-6 text-sm text-muted-foreground">
                      This owner has no stores.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="border-b bg-muted/40">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium">
                              Store Name
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Email
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Address
                            </th>
                            <th className="px-4 py-3 text-left font-medium">
                              Rating
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y">
                          {data.stores.map((store) => (
                            <tr
                              key={store.id}
                              className="hover:bg-muted/30"
                            >
                              <td className="px-4 py-3 font-medium">
                                {store.name}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {store.email}
                              </td>
                              <td className="px-4 py-3 text-muted-foreground">
                                {store.address || "—"}
                              </td>
                              <td className="px-4 py-3 font-medium">
                                {store.averageRating > 0
                                  ? `${store.averageRating} / 5`
                                  : "No ratings"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}

export default AdminUserDetails;