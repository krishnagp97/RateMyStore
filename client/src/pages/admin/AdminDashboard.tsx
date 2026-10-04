import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Store, Users, Star, LoaderCircle, AlertCircle } from "lucide-react";
import { getAdminDashboard } from "@/services/adminService";
import type { AdminDashboardStats } from "@/services/adminService";

function AdminDashboard() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAdminDashboard();
        setStats(data);
      } catch {
        setError("Unable to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const statCards = [
    {
      title: "Total Stores",
      value: stats?.totalStores ?? 0,
      description: "Stores registered on the platform",
      icon: Store,
    },
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      description: "Registered platform users",
      icon: Users,
    },
    {
      title: "Total Ratings",
      value: stats?.totalRatings ?? 0,
      description: "Ratings submitted by users",
      icon: Star,
    },
  ];

  return (
    <DashboardLayout
      title="Admin Dashboard"
      description="Monitor and manage your platform."
      role="ADMIN"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">
          Overview
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Here is a snapshot of your RateMyStore platform.
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/40">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="mt-0.5 size-5 text-destructive" />

            <div>
              <p className="font-medium">Unable to load dashboard</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>

                <Icon className="size-4 text-muted-foreground" />
              </CardHeader>

              <CardContent>
                <div className="text-3xl font-bold">
                  {loading ? (
                    <LoaderCircle className="size-6 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Platform overview</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm leading-6 text-muted-foreground">
            Manage stores and users from the admin navigation. The statistics
            above are fetched directly from the RateMyStore backend.
          </p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export default AdminDashboard;