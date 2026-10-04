
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Store,
  Users,
  Star,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { logout } from "../utils/auth";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  role: "ADMIN" | "USER" | "OWNER";
}

const navigation = {
  ADMIN: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Stores", href: "/admin/stores", icon: Store },
    { label: "Users", href: "/admin/users", icon: Users },
  ],
  USER: [
    { label: "Browse Stores", href: "/stores", icon: Store },
  ],
  OWNER: [
    { label: "Dashboard", href: "/owner", icon: LayoutDashboard },
    { label: "Ratings", href: "/owner/ratings", icon: Star },
  ],
};

function DashboardLayout({
  children,
  title,
  description,
  role,
}: DashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const links = navigation[role];

  return (
    <div className="min-h-screen bg-muted/30">
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-background transition-transform md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="rounded-lg bg-primary p-2 text-primary-foreground">
            <Store className="size-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">RateMyStore</span>
          <button
            type="button"
            aria-label="Close navigation"
            className="ml-auto rounded-md p-2 hover:bg-muted md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workspace
          </p>
          <nav className="space-y-1">
            {links.map(({ label, href, icon: Icon }) => {
              const active = location.pathname === href;

              return (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted/60 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">{role}</p>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </aside>

      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur sm:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Open navigation"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="size-5" />
          </Button>

          <div>
            <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {description}
            </p>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
