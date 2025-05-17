import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Egg } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

export function EggsPanel() {
  const { toast } = useToast();
  const { data: eggs, isLoading, isError, refetch } = useQuery<Egg[]>({
    queryKey: ["/api/skyport/eggs"],
    retry: 1,
  });

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing eggs",
      description: "Fetching latest egg data from Skyport API",
    });
  };

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Server Eggs</CardTitle>
          <CardDescription>
            Manage your Skyport Panel server templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
            <FontAwesomeIcon icon="egg" className="text-muted-foreground h-12 w-12" />
            <h3 className="text-lg font-medium">Could not fetch eggs</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              There was an error fetching egg data from the Skyport API. Make sure you've configured your API key in the settings.
            </p>
            <Button onClick={handleRefresh}>
              <FontAwesomeIcon icon="egg" className="mr-2" />
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
          <CardTitle>Server Eggs</CardTitle>
          <CardDescription>
            Manage your Skyport Panel server templates
          </CardDescription>
        </div>
        <Button onClick={handleRefresh} disabled={isLoading}>
          <FontAwesomeIcon icon="egg" className="mr-2" />
          Refresh Eggs
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
          <ScrollArea className="h-[400px] rounded-md">
            <Table>
              <TableCaption>{eggs?.length || 0} eggs found</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Nest</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Docker Image</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eggs?.map((egg) => (
                  <TableRow key={egg.id}>
                    <TableCell className="font-medium">{egg.name}</TableCell>
                    <TableCell>{egg.nest}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {egg.description || "No description"}
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {egg.dockerImage || "N/A"}
                    </TableCell>
                  </TableRow>
                ))}

                {(!eggs || eggs.length === 0) && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                      No eggs found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
