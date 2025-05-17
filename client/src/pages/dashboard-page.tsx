import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ServerList } from "@/components/dashboard/server-list";
import { useQuery } from "@tanstack/react-query";
import { Server } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: servers, isLoading } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  // Calculate stats
  const totalServers = servers?.length || 0;
  const onlineServers = servers?.filter(s => s.status === "online").length || 0;
  const totalPlayers = servers?.reduce((sum, server) => sum + (server.players || 0), 0) || 0;
  const totalMaxPlayers = servers?.reduce((sum, server) => sum + (server.maxPlayers || 0), 0) || 0;

  return (
    <DashboardLayout title="Dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : (
          <>
            <StatsCard
              title="Online Servers"
              value={`${onlineServers} / ${totalServers}`}
              icon="server"
              iconColor="bg-green-500"
              linkText="View all servers"
              linkHref="/servers"
            />
            <StatsCard
              title="CPU Usage"
              value="42%"
              icon="microchip"
              iconColor="bg-blue-500"
              linkText="View system resources"
              linkHref="/resources"
            />
            <StatsCard
              title="Players Online"
              value={`${totalPlayers} / ${totalMaxPlayers}`}
              icon="users"
              iconColor="bg-purple-500"
              linkText="View player stats"
              linkHref="/players"
            />
          </>
        )}
      </div>

      {/* Server List */}
      <div className="mb-8">
        <ServerList />
      </div>

      {/* Admin Controls (only for admins) */}
      {user?.isAdmin && (
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Admin Controls</CardTitle>
              <CardDescription>
                Administrative tools and quick actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Nodes Card */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium">Server Nodes</h3>
                    <div className="mt-2 max-w-xl text-sm text-muted-foreground">
                      <p>Manage your Skyport Panel server nodes.</p>
                    </div>
                    <div className="mt-5">
                      <Link href="/admin">
                        <Button className="inline-flex items-center">
                          <FontAwesomeIcon icon="server" className="mr-2" />
                          View Nodes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Eggs Card */}
                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium">Server Eggs</h3>
                    <div className="mt-2 max-w-xl text-sm text-muted-foreground">
                      <p>Manage your Skyport Panel server templates.</p>
                    </div>
                    <div className="mt-5">
                      <Link href="/admin">
                        <Button className="inline-flex items-center">
                          <FontAwesomeIcon icon="egg" className="mr-2" />
                          View Eggs
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
