import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Node } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export function NodesPanel() {
  const { toast } = useToast();
  const { data: nodes, isLoading, isError, refetch } = useQuery<Node[]>({
    queryKey: ["/api/skyport/nodes"],
    retry: 1,
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing nodes",
      description: "Fetching latest node data from Skyport API",
    });
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Server Nodes</CardTitle>
          <CardDescription>
            Manage your Skyport Panel server nodes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <FontAwesomeIcon icon="server" className="text-muted-foreground h-12 w-12" />
            <h3 className="text-lg font-medium">Could not fetch nodes</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              There was an error fetching node data from the Skyport API. Make sure you've configured your API key in the settings.
            </p>
            <Button onClick={handleRefresh}>
              <FontAwesomeIcon icon="server" className="mr-2" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Server Nodes</CardTitle>
          <CardDescription>
            Manage your Skyport Panel server nodes
          </CardDescription>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <FontAwesomeIcon icon="server" className="mr-2" />
          Refresh Nodes
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : (
          <Table>
            <TableCaption>{nodes?.length || 0} nodes found</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Memory</TableHead>
                <TableHead>Disk</TableHead>
                <TableHead>Servers</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nodes?.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell>{node.location}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs">
                        {formatMemory(node.memoryUsed)} / {formatMemory(node.memory)}
                      </div>
                      <Progress value={(node.memoryUsed / node.memory) * 100} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-xs">
                        {formatMemory(node.diskUsed)} / {formatMemory(node.disk)}
                      </div>
                      <Progress value={(node.diskUsed / node.disk) * 100} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>{node.servers}</TableCell>
                  <TableCell>
                    <NodeStatusBadge status={node.status} />
                  </TableCell>
                </TableRow>
              ))}

              {(!nodes || nodes.length === 0) && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No nodes found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

function formatMemory(bytes: number): string {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

function NodeStatusBadge({ status }: { status: string }) {
  const statusLower = status.toLowerCase();
  
  if (statusLower === "running" || statusLower === "online") {
    return <Badge variant="success">Running</Badge>;
  }
  
  if (statusLower === "installing" || statusLower === "updating") {
    return <Badge variant="warning">{status}</Badge>;
  }
  
  return <Badge variant="destructive">{status || "Unknown"}</Badge>;
}
