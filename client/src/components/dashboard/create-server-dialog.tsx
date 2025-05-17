import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { InsertServer } from "@shared/schema";

const serverSchema = z.object({
  name: z.string().min(3, "Server name must be at least 3 characters"),
  identifier: z.string().min(3, "Server identifier must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed"),
  address: z.string().min(3, "Server address must be valid"),
  serverType: z.enum(["survival", "creative", "skyblock", "custom"]),
  maxPlayers: z.string().transform(val => parseInt(val, 10)),
});

type ServerFormValues = z.infer<typeof serverSchema>;

export function CreateServerDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverSchema),
    defaultValues: {
      name: "",
      identifier: "",
      address: "",
      serverType: "survival",
      maxPlayers: "20",
    },
  });

  const createServerMutation = useMutation({
    mutationFn: async (data: Omit<ServerFormValues, "serverType">) => {
      const serverData: InsertServer = {
        name: data.name,
        identifier: data.identifier,
        address: data.address,
        maxPlayers: data.maxPlayers,
        status: "offline", // New servers start offline
        players: 0,
        memory: "1.0 GB",
        uptime: "0d 0h 0m",
      };
      
      const res = await apiRequest("POST", "/api/servers", serverData);
      return res.json();
    },
    onSuccess: () => {
      setOpen(false);
      form.reset();
      toast({
        title: "Server created",
        description: "Your new Minecraft server has been created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/servers"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to create server",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(data: ServerFormValues) {
    const { serverType, ...serverData } = data;
    createServerMutation.mutate(serverData);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="create-server-btn bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400">
          <FontAwesomeIcon icon="plus" className="mr-2" />
          Create New Server
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-gray-900 to-black border-primary pixel-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold minecraft-text text-primary">Create New Server</DialogTitle>
          <DialogDescription className="text-gray-300">
            Set up a new Minecraft server instance here.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Server Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="My Awesome Server" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Server Identifier</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="my-awesome-server" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Server Address</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="myserver.example.com:25565" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serverType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Server Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select server type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="survival">Survival</SelectItem>
                        <SelectItem value="creative">Creative</SelectItem>
                        <SelectItem value="skyblock">SkyBlock</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="maxPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Max Players</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" max="200" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="submit" 
                disabled={createServerMutation.isPending}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-400"
              >
                {createServerMutation.isPending ? (
                  <>
                    <FontAwesomeIcon icon="spinner" spin className="mr-2" />
                    Creating Server...
                  </>
                ) : (
                  "Create Server"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}