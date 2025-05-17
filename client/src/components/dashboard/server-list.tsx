import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Server } from "@shared/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ServerList() {
  const { data: servers, isLoading } = useQuery<Server[]>({
    queryKey: ["/api/servers"],
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Servers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-12 w-12 rounded-md" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Servers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {servers?.map((server) => (
            <div
              key={server.id}
              className="py-4 first:pt-0 last:pb-0 hover:bg-muted/50 rounded-md -mx-2 px-2 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={getServerIcon(server.name)}
                      className="text-primary"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-primary truncate">
                      {server.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {server.address}
                    </p>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <ServerStatusBadge status={server.status} />
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex space-x-6">
                  <p className="flex items-center text-sm text-muted-foreground">
                    <FontAwesomeIcon
                      icon="users"
                      className="flex-shrink-0 mr-1.5 text-muted-foreground"
                    />
                    {server.players}/{server.maxPlayers} players
                  </p>
                  <p className="mt-2 flex items-center text-sm text-muted-foreground sm:mt-0">
                    <FontAwesomeIcon
                      icon="hdd"
                      className="flex-shrink-0 mr-1.5 text-muted-foreground"
                    />
                    {server.memory}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-muted-foreground sm:mt-0">
                  <FontAwesomeIcon
                    icon="clock"
                    className="flex-shrink-0 mr-1.5 text-muted-foreground"
                  />
                  <p>
                    {server.status === "online"
                      ? `Uptime: ${server.uptime}`
                      : `Downtime: ${server.uptime || "unknown"}`}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {!servers?.length && (
            <div className="py-4 text-center text-muted-foreground">
              No servers found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function ServerStatusBadge({ status }: { status: string }) {
  if (status === "online") {
    return (
      <Badge variant="success" className="capitalize">
        Online
      </Badge>
    );
  }
  return (
    <Badge variant="destructive" className="capitalize">
      Offline
    </Badge>
  );
}

function getServerIcon(serverName: string): any {
  const name = serverName.toLowerCase();
  if (name.includes("skyblock")) return "dragon";
  if (name.includes("creative")) return "cubes";
  return "cube";
}
