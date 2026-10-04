import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/lib/axios";
import {
  Search,
  Store as StoreIcon,
  MapPin,
  Star,
  LoaderCircle,
  AlertCircle,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { submitRating, updateRating } from "@/services/ratingService";

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

function UserStores() {
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedRatings, setSelectedRatings] = useState<
    Record<string, number>
  >({});
  const [savingStoreId, setSavingStoreId] = useState<string | null>(null);
  const [ratingMessages, setRatingMessages] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    let cancelled = false;

    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await api.get<StoresResponse>("/stores", {
          params: { search: search.trim() },
        });

        if (!cancelled) {
          setStores(response.data.stores);
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message =
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            typeof err.response === "object" &&
            err.response !== null &&
            "data" in err.response &&
            typeof err.response.data === "object" &&
            err.response.data !== null &&
            "message" in err.response.data &&
            typeof err.response.data.message === "string"
              ? err.response.data.message
              : "Could not load stores. Please try again.";

          setError(message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search]);

  const handleRating = async (store: StoreItem) => {
    const rating = selectedRatings[store.id];

    if (!rating || rating < 1 || rating > 5) {
      setRatingMessages((previous) => ({
        ...previous,
        [store.id]: "Choose a rating from 1 to 5.",
      }));
      return;
    }

    setSavingStoreId(store.id);
    setRatingMessages((previous) => ({ ...previous, [store.id]: "" }));

    try {
      if (store.userRating === null) {
        await submitRating(store.id, rating);
      } else {
        await updateRating(store.id, rating);
      }

      setRatingMessages((previous) => ({
        ...previous,
        [store.id]: "Rating saved successfully.",
      }));

      const response = await api.get<StoresResponse>("/stores", {
        params: { search: search.trim() },
      });

      setStores(response.data.stores);
      setSelectedRatings((previous) => {
        const next = { ...previous };
        delete next[store.id];
        return next;
      });
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof err.response === "object" &&
        err.response !== null &&
        "data" in err.response &&
        typeof err.response.data === "object" &&
        err.response.data !== null &&
        "message" in err.response.data &&
        typeof err.response.data.message === "string"
          ? err.response.data.message
          : "Could not save your rating. Please try again.";

      setRatingMessages((previous) => ({
        ...previous,
        [store.id]: message,
      }));
    } finally {
      setSavingStoreId(null);
    }
  };

  return (
    <DashboardLayout
      title="Browse stores"
      description="Find a store and see what customers think."
      role="USER"
    >
      <div className="mb-8">
        <p className="text-sm font-medium text-primary">STORE DIRECTORY</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Find a store
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          Explore registered stores, compare customer ratings, and see your own
          rating for each place.
        </p>
      </div>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or address"
            aria-label="Search stores by name or address"
            className="h-10 pl-9"
          />
        </div>

        <p className="text-sm text-muted-foreground" aria-live="polite">
          {loading
            ? "Loading stores…"
            : `${stores.length} ${stores.length === 1 ? "store" : "stores"}`}
        </p>
      </div>

      {error && (
        <Card className="mb-5 border-destructive/40">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="mt-0.5 size-5 text-destructive" />
            <div>
              <p className="font-medium">Unable to load stores</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="overflow-hidden rounded-xl py-0">
        <div className="grid grid-cols-[minmax(0,1fr)_130px] items-center border-b bg-muted/30 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground sm:grid-cols-[minmax(0,1fr)_150px_130px]">
          <span>Store</span>
          <span className="hidden sm:block">Your rating</span>
          <span className="text-right">Overall rating</span>
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-muted-foreground">
            <LoaderCircle className="size-4 animate-spin" />
            Loading store directory…
          </div>
        ) : error ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Check your connection and try searching again.
          </div>
        ) : stores.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center px-5 py-10 text-center">
            <StoreIcon className="size-8 text-muted-foreground/60" />
            <h3 className="mt-4 font-medium">
              {search.trim()
                ? "No matching stores"
                : "No stores registered yet"}
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {search.trim()
                ? "Try a different store name or address."
                : "Registered stores will appear here when they are available."}
            </p>
          </div>
        ) : (
          <div>
            {stores.map((store, index) => (
              <div
                key={store.id}
                className={`grid grid-cols-[minmax(0,1fr)_130px] items-center gap-3 px-4 py-5 sm:grid-cols-[minmax(0,1fr)_150px_130px] sm:px-5 ${
                  index < stores.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="hidden size-10 shrink-0 items-center justify-center rounded-lg border bg-background sm:flex">
                    <StoreIcon className="size-5 text-muted-foreground" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-medium">{store.name}</h3>

                    <p className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="mt-0.5 size-3.5 shrink-0" />
                      <span className="line-clamp-2">{store.address}</span>
                    </p>

                    <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                      <Mail className="size-3.5 shrink-0" />
                      <span className="truncate">{store.email}</span>
                    </p>

                    <div className="mt-3 sm:hidden">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Your rating
                      </p>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((value) => (
                          <button
                            key={value}
                            type="button"
                            aria-label={`${value} star${value === 1 ? "" : "s"}`}
                            aria-pressed={
                              (selectedRatings[store.id] ??
                                store.userRating) === value
                            }
                            disabled={savingStoreId === store.id}
                            onClick={() =>
                              setSelectedRatings((previous) => ({
                                ...previous,
                                [store.id]: value,
                              }))
                            }
                            className="rounded-sm p-1 hover:bg-muted disabled:opacity-50"
                          >
                            <Star
                              className={`size-5 ${
                                value <=
                                (selectedRatings[store.id] ??
                                  store.userRating ??
                                  0)
                                  ? "fill-amber-400 text-amber-500"
                                  : "text-muted-foreground/40"
                              }`}
                            />
                          </button>
                        ))}
                      </div>

                      <Button
                        size="sm"
                        variant="outline"
                        className="mt-2 h-8"
                        disabled={
                          savingStoreId === store.id ||
                          selectedRatings[store.id] === undefined
                        }
                        onClick={() => handleRating(store)}
                      >
                        {savingStoreId === store.id
                          ? "Saving..."
                          : store.userRating === null
                            ? "Submit rating"
                            : "Update rating"}
                      </Button>

                      {ratingMessages[store.id] && (
                        <p
                          className="mt-1 text-xs text-muted-foreground"
                          aria-live="polite"
                        >
                          {ratingMessages[store.id]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div
                    className="flex items-center gap-0.5"
                    role="group"
                    aria-label={`Rate ${store.name}`}
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        aria-label={`${value} star${value === 1 ? "" : "s"}`}
                        aria-pressed={
                          (selectedRatings[store.id] ?? store.userRating) ===
                          value
                        }
                        disabled={savingStoreId === store.id}
                        onClick={() =>
                          setSelectedRatings((previous) => ({
                            ...previous,
                            [store.id]: value,
                          }))
                        }
                        className="rounded-sm p-0.5 transition-colors hover:bg-muted disabled:opacity-50"
                      >
                        <Star
                          className={`size-4 ${
                            value <=
                            (selectedRatings[store.id] ?? store.userRating ?? 0)
                              ? "fill-amber-400 text-amber-500"
                              : "text-muted-foreground/40"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-8"
                    disabled={
                      savingStoreId === store.id ||
                      selectedRatings[store.id] === undefined
                    }
                    onClick={() => handleRating(store)}
                  >
                    {savingStoreId === store.id
                      ? "Saving..."
                      : store.userRating === null
                        ? "Submit rating"
                        : "Update rating"}
                  </Button>

                  {ratingMessages[store.id] && (
                    <p
                      className="mt-1 max-w-40 text-xs text-muted-foreground"
                      aria-live="polite"
                    >
                      {ratingMessages[store.id]}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Star className="size-4 fill-amber-400 text-amber-500" />
                    <span className="font-semibold tabular-nums">
                      {store.overallRating > 0
                        ? store.overallRating.toFixed(1)
                        : "—"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 5</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {store.overallRating > 0
                      ? "Customer rating"
                      : "No ratings yet"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </DashboardLayout>
  );
}

export default UserStores;
