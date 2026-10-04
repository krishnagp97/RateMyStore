import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, LoaderCircle, AlertCircle, UserPlus } from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAdminUsers } from "@/services/adminService";
import type { AdminUser } from "@/services/adminService";

function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminUsers({
          name: name.trim() || undefined,
          role: role || undefined,
        });

        setUsers(data.users);
      } catch {
        setError("Unable to load users.");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(loadUsers, 250);

    return () => clearTimeout(timeout);
  }, [name, role]);

  return (
    <DashboardLayout
      title="Users"
      description="View and manage registered platform users."
      role="ADMIN"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              User Management
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Search users and filter accounts by role.
            </p>
          </div>

          <Button onClick={() => navigate("/admin/users/add")}>
            <UserPlus className="mr-2 size-4" />
            Add User
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Search by name..."
                  className="pl-9"
                />
              </div>

              <select
                value={role}
                onChange={(event) => setRole(event.target.value)}
                className="h-10 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">All roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="OWNER">Owner</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/40">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="mt-0.5 size-5 text-destructive" />

              <div>
                <p className="font-medium">Unable to load users</p>
                <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
                <LoaderCircle className="size-4 animate-spin" />
                Loading users…
              </div>
            ) : users.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                No users found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Name</th>
                      <th className="px-4 py-3 text-left font-medium">Email</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Address
                      </th>
                      <th className="px-4 py-3 text-left font-medium">Role</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{user.name}</td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {user.email}
                        </td>

                        <td className="max-w-xs px-4 py-3 text-muted-foreground">
                          <span className="block truncate">
                            {user.address || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span className="rounded-md border px-2 py-1 text-xs font-medium">
                            {user.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default AdminUsers;
