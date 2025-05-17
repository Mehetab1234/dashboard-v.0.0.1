import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import { Settings } from "@shared/schema";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Sidebar({ className }: { className?: string }) {
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const dashboardName = settings?.dashboardName || "MinePanel";

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: "tachometer-alt",
      active: location === "/dashboard",
    },
    {
      name: "Servers",
      href: "/servers",
      icon: "server",
      active: location === "/servers",
    },
  ];

  const adminItems = [
    {
      name: "Admin Panel",
      href: "/admin",
      icon: "user-shield",
      active: location === "/admin",
    },
  ];

  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "U";

  const avatarUrl = user?.discordAvatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`
    : null;

  return (
    <aside
      className={cn(
        "flex flex-col h-screen w-64 bg-gray-800 text-white",
        className
      )}
    >
      <div className="p-4">
        <Link href="/">
          <span className="text-xl font-bold cursor-pointer">
            {dashboardName.split(/(?=[A-Z])/).map((part, i) => (
              <span key={i} className={i % 2 ? "text-primary" : ""}>
                {part}
              </span>
            ))}
          </span>
        </Link>
      </div>

      <nav className="flex-1 mt-6 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link key={item.name} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white",
                item.active && "bg-gray-900 text-white"
              )}
            >
              <FontAwesomeIcon icon={item.icon} className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          </Link>
        ))}

        {user?.isAdmin && (
          <>
            <Separator className="my-4 bg-gray-700" />
            {adminItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-gray-300 hover:bg-gray-700 hover:text-white",
                    item.active && "bg-gray-900 text-white"
                  )}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-3 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            ))}
          </>
        )}
      </nav>

      <div className="p-4 bg-gray-700">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src={avatarUrl || undefined} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.username}</p>
            <Button
              variant="link"
              size="sm"
              className="p-0 h-auto text-xs text-gray-300 hover:text-gray-200"
              onClick={() => logoutMutation.mutate()}
            >
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
