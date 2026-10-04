import { useEffect, useState } from "react";
import {
  Search,
  LoaderCircle,
  AlertCircle,
  Plus,
  ArrowUpDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAdminStores, type AdminStore } from "@/services/adminService";

function AdminStores() {
  const [stores, setStores] = useState<AdminStore[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "address" | "rating">(
    "name",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const navigate = useNavigate();

  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminStores({
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
        });

        setStores(data.stores);
      } catch {
        setError("Unable to load stores.");
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(loadStores, 250);

    return () => clearTimeout(timeout);
  }, [name, email, address]);

  const sortedStores = [...stores].sort((a, b) => {
    let valueA: string | number;
    let valueB: string | number;

    if (sortBy === "rating") {
      valueA = a.overallRating;
      valueB = b.overallRating;
    } else {
      valueA = a[sortBy].toLowerCase();
      valueB = b[sortBy].toLowerCase();
    }

    if (valueA < valueB) return sortOrder === "asc" ? -1 : 1;
    if (valueA > valueB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: "name" | "email" | "address" | "rating") => {
    if (sortBy === field) {
      setSortOrder((current) => (current === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortOrder("asc");
    }
  };
  return (
    <DashboardLayout
      title="Stores"
      description="View and manage stores registered on the platform."
      role="ADMIN"
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              Store Management
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Search stores by name, email, or address.
            </p>
          </div>

          <Button onClick={() => navigate("/admin/stores/add")}>
            <Plus className="mr-2 size-4" />
            Add Store
          </Button>
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Search by name..."
                  className="pl-9"
                />
              </div>

              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Filter by email..."
              />

              <Input
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Filter by address..."
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/40">
            <CardContent className="flex items-start gap-3 p-4">
              <AlertCircle className="mt-0.5 size-5 text-destructive" />

              <div>
                <p className="font-medium">Unable to load stores</p>

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
                Loading stores…
              </div>
            ) : stores.length === 0 ? (
              <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                No stores found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">
                        <button
                          type="button"
                          onClick={() => handleSort("name")}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          Store Name
                          <ArrowUpDown className="size-3.5" />
                        </button>
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        <button
                          type="button"
                          onClick={() => handleSort("email")}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          Email
                          <ArrowUpDown className="size-3.5" />
                        </button>
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        <button
                          type="button"
                          onClick={() => handleSort("address")}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          Address
                          <ArrowUpDown className="size-3.5" />
                        </button>
                      </th>

                      <th className="px-4 py-3 text-left font-medium">
                        <button
                          type="button"
                          onClick={() => handleSort("rating")}
                          className="inline-flex items-center gap-1 hover:text-foreground"
                        >
                          Rating
                          <ArrowUpDown className="size-3.5" />
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {sortedStores.map((store) => (
                      <tr key={store.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3 font-medium">{store.name}</td>

                        <td className="px-4 py-3 text-muted-foreground">
                          {store.email}
                        </td>

                        <td className="max-w-xs px-4 py-3 text-muted-foreground">
                          <span className="block truncate">
                            {store.address || "—"}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {store.overallRating > 0
                            ? `${store.overallRating} / 5`
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
      </div>
    </DashboardLayout>
  );
}

export default AdminStores;
