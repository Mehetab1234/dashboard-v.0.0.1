import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NodesPanel } from "@/components/admin/nodes-panel";
import { EggsPanel } from "@/components/admin/eggs-panel";
import { BrandingPanel } from "@/components/admin/branding-panel";

export default function AdminPage() {
  return (
    <DashboardLayout title="Admin Panel">
      <Tabs defaultValue="nodes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nodes">Server Nodes</TabsTrigger>
          <TabsTrigger value="eggs">Server Eggs</TabsTrigger>
          <TabsTrigger value="branding">Dashboard Branding</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nodes" className="space-y-4">
          <NodesPanel />
        </TabsContent>
        
        <TabsContent value="eggs" className="space-y-4">
          <EggsPanel />
        </TabsContent>
        
        <TabsContent value="branding" className="space-y-4">
          <BrandingPanel />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
