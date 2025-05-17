import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  dashboardName: z.string().min(3, "Dashboard name must be at least 3 characters"),
  skyportApiKey: z.string().optional(),
  skyportApiUrl: z.string().url("Please enter a valid URL").optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function BrandingPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: settings, isLoading } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dashboardName: settings?.dashboardName || "",
      skyportApiKey: settings?.skyportApiKey || "",
      skyportApiUrl: settings?.skyportApiUrl || "https://skyport.panel/api",
    },
  });
  
  // Update form values when settings are loaded
  if (settings && !form.formState.isDirty) {
    form.reset({
      dashboardName: settings.dashboardName,
      skyportApiKey: settings.skyportApiKey || "",
      skyportApiUrl: settings.skyportApiUrl || "https://skyport.panel/api",
    });
  }
  
  const mutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/settings", data);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Dashboard settings have been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update settings",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  function onSubmit(data: FormValues) {
    mutation.mutate(data);
  }
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Settings</CardTitle>
          <CardDescription>
            Customize your dashboard appearance and API configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-24" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dashboard Settings</CardTitle>
        <CardDescription>
          Customize your dashboard appearance and API configuration
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="dashboardName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dashboard Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="MinePanel" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skyportApiKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skyport API Key</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Enter your Skyport API key" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="skyportApiUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Skyport API URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://skyport.panel/api" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              disabled={mutation.isPending || !form.formState.isDirty}
            >
              {mutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
