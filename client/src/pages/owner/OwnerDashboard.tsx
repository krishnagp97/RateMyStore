import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOwnerStoreRatings } from "@/services/ownerService";
import type { OwnerStoreRatings } from "@/services/ownerService";
import api from "@/lib/axios";
import { Star, Users, Store, LoaderCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface StoreItem {
  id: string;
  name: string;
  email: string;
  address: string;
  overallRating: number;
  userRating: number | null;
}

interface StoresResponse {
  stores: StoreItem[];
}

function OwnerDashboard() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [ratingsData, setRatingsData] = useState<OwnerStoreRatings | null>(
    null,
  );
  const [loadingStores, setLoadingStores] = useState(true);
  const [loadingRatings, setLoadingRatings] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const loadStores = async () => {
      try {
        setLoadingStores(true);
        setError("");

        const response = await api.get<StoresResponse>("/stores");

        setStores(response.data.stores);

        if (response.data.stores.length > 0) {
          setSelectedStoreId(response.data.stores[0].id);
        }
      } catch {
        setError("Unable to load your stores.");
      } finally {
        setLoadingStores(false);
      }
    };

    loadStores();
  }, []);

  useEffect(() => {
    if (!selectedStoreId) {
      setRatingsData(null);
      return;
    }

    const loadRatings = async () => {
      try {
        setLoadingRatings(true);
        setError("");

        const data = await getOwnerStoreRatings(selectedStoreId);
        setRatingsData(data);
      } catch {
        setRatingsData(null);
        setError("Unable to load ratings for this store.");
      } finally {
        setLoadingRatings(false);
      }
    };

    loadRatings();
  }, [selectedStoreId]);

  return (
    <DashboardLayout
      title="Store Owner Dashboard"
      description="Track your store's ratings and customer feedback."
      role="OWNER"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-primary">STORE PERFORMANCE</p>

          <h2 className="mt-2 text-2xl font-semibold tracking-tight">
            Ratings overview
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            See how customers rate your store and review the feedback you've
            received.
          </p>
        </div>

        <Button onClick={() => navigate("/owner/add-store")}>Add Store</Button>
      </div>

      {loadingStores ? (
        <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" />
          Loading your stores…
        </div>
      ) : stores.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex min-h-56 flex-col items-center justify-center text-center">
            <Store className="size-8 text-muted-foreground/60" />

            <h3 className="mt-4 font-medium">No store found</h3>

            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Your store will appear here once an administrator has registered
              it for your account.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6">
            <label
              htmlFor="store-select"
              className="mb-2 block text-sm font-medium"
            >
              Store
            </label>

            <select
              id="store-select"
              value={selectedStoreId}
              onChange={(event) => setSelectedStoreId(event.target.value)}
              className="h-10 w-full max-w-md rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <Card className="mb-6 border-destructive/40">
              <CardContent className="flex items-start gap-3 p-4">
                <AlertCircle className="mt-0.5 size-5 text-destructive" />

                <div>
                  <p className="font-medium">Unable to load data</p>
                  <p className="mt-1 text-sm text-muted-foreground">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {loadingRatings ? (
            <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
              <LoaderCircle className="size-4 animate-spin" />
              Loading ratings…
            </div>
          ) : ratingsData ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average rating
                    </CardTitle>

                    <Star className="size-4 text-muted-foreground" />
                  </CardHeader>

                  <CardContent>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-semibold">
                        {ratingsData.averageRating > 0
                          ? ratingsData.averageRating.toFixed(1)
                          : "—"}
                      </span>

                      {ratingsData.averageRating > 0 && (
                        <Star className="size-5 fill-amber-400 text-amber-500" />
                      )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Out of 5
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total ratings
                    </CardTitle>

                    <Users className="size-4 text-muted-foreground" />
                  </CardHeader>

                  <CardContent>
                    <div className="text-3xl font-semibold">
                      {ratingsData.totalRatings}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Customer ratings received
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Customer ratings</CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  {ratingsData.ratings.length === 0 ? (
                    <div className="px-6 py-10 text-center">
                      <p className="text-sm font-medium">No ratings yet</p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        Customer ratings will appear here when users rate your
                        store.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {ratingsData.ratings.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 px-6 py-4"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium">
                              {item.user.name}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                              {item.user.email}
                            </p>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <Star className="size-4 fill-amber-400 text-amber-500" />

                            <span className="text-sm font-medium">
                              {item.rating}/5
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : null}
        </>
      )}
    </DashboardLayout>
  );
}

export default OwnerDashboard;
