import { useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCard } from "@/components/dashboard/stats-card";
import { ServerList } from "@/components/dashboard/server-list";
import { CreateServerDialog } from "@/components/dashboard/create-server-dialog";
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

  // Animation classes for elements
  useEffect(() => {
    const elements = document.querySelectorAll('.animate-on-mount');
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animate-fadein');
        el.classList.remove('opacity-0');
      }, index * 100);
    });
  }, []);

  return (
    <DashboardLayout title="Dashboard">
      {/* Hero Banner with Server Creation */}
      <div className="mb-8 relative overflow-hidden bg-gradient-to-r from-black to-gray-900 rounded-lg p-6 pixel-border border-primary">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white mb-2 minecraft-text">Welcome to CrazeDash</h2>
          <p className="text-gray-300 mb-6 max-w-2xl">
            Manage your Minecraft servers with powerful tools and real-time monitoring. 
            Create, configure, and control your servers with ease.
          </p>
          <div className="flex flex-wrap gap-4">
            <CreateServerDialog />
            <Button variant="outline" className="border-primary">
              <FontAwesomeIcon icon="book" className="mr-2" />
              View Documentation
            </Button>
          </div>
        </div>
        
        {/* Background Animation Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-20 pointer-events-none">
          <div className="floating-block grass" style={{ top: '20%', right: '20%', width: '40px', height: '40px', animationDelay: '0s' }}></div>
          <div className="floating-block dirt" style={{ top: '60%', right: '10%', width: '30px', height: '30px', animationDelay: '1.2s' }}></div>
          <div className="floating-block stone" style={{ top: '30%', right: '40%', width: '25px', height: '25px', animationDelay: '0.5s' }}></div>
        </div>
      </div>

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
            <div className="animate-on-mount opacity-0 delay-100">
              <StatsCard
                title="Online Servers"
                value={`${onlineServers} / ${totalServers}`}
                icon="server"
                iconColor="bg-green-600"
                linkText="View all servers"
                linkHref="/servers"
              />
            </div>
            <div className="animate-on-mount opacity-0 delay-200">
              <StatsCard
                title="CPU Usage"
                value="42%"
                icon="microchip"
                iconColor="bg-accent"
                linkText="View system resources"
                linkHref="/resources"
              />
            </div>
            <div className="animate-on-mount opacity-0 delay-300">
              <StatsCard
                title="Players Online"
                value={`${totalPlayers} / ${totalMaxPlayers}`}
                icon="users"
                iconColor="bg-purple-600"
                linkText="View player stats"
                linkHref="/players"
              />
            </div>
          </>
        )}
      </div>

      {/* Server List with Create Server Button */}
      <div className="mb-8 animate-on-mount opacity-0 delay-400">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold minecraft-text text-primary">Your Minecraft Servers</h2>
          <CreateServerDialog />
        </div>
        <ServerList />
      </div>

      {/* Admin Controls (only for admins) */}
      {user?.isAdmin && (
        <div className="mt-8 animate-on-mount opacity-0 delay-500">
          <Card className="bg-black border-primary">
            <CardHeader>
              <CardTitle className="text-primary">Admin Controls</CardTitle>
              <CardDescription>
                Administrative tools and quick actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {/* Nodes Card */}
                <div className="bg-gradient-to-b from-gray-900 to-black overflow-hidden shadow rounded-lg border border-gray-800 hover:border-primary transition-colors">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-primary minecraft-text">Server Nodes</h3>
                    <div className="mt-2 max-w-xl text-sm text-muted-foreground">
                      <p>Manage your Skyport Panel server nodes.</p>
                    </div>
                    <div className="mt-5">
                      <Link href="/admin">
                        <Button className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400">
                          <FontAwesomeIcon icon="server" className="mr-2" />
                          View Nodes
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Eggs Card */}
                <div className="bg-gradient-to-b from-gray-900 to-black overflow-hidden shadow rounded-lg border border-gray-800 hover:border-primary transition-colors">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-primary minecraft-text">Server Eggs</h3>
                    <div className="mt-2 max-w-xl text-sm text-muted-foreground">
                      <p>Manage your Skyport Panel server templates.</p>
                    </div>
                    <div className="mt-5">
                      <Link href="/admin">
                        <Button className="inline-flex items-center bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400">
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
