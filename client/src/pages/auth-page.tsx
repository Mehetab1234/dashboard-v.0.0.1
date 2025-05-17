import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect, useLocation } from "wouter";
import { AuthForms } from "@/components/auth/auth-forms";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import { Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const dashboardName = settings?.dashboardName || "MinePanel";

  // Redirect to dashboard if already logged in
  if (user && !isLoading) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-1 md:grid md:grid-cols-2">
          {/* Form side */}
          <div className="w-full flex items-center justify-center p-8">
            <AuthForms />
          </div>

          {/* Image/information side */}
          <div className="hidden md:block bg-primary-900">
            <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-primary-800 to-primary-600 text-white p-8">
              <div className="max-w-md text-center">
                <h1 className="text-4xl font-bold mb-6">
                  Welcome to {dashboardName}
                </h1>
                <p className="text-xl mb-8">
                  Manage your Minecraft servers with ease, monitor performance,
                  and keep your players happy.
                </p>

                <div className="grid grid-cols-1 gap-4 mt-12">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
                    <h3 className="font-medium text-lg mb-2">Server Management</h3>
                    <p className="text-sm opacity-90">
                      Start, stop, and restart your Minecraft servers with a single click.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
                    <h3 className="font-medium text-lg mb-2">Resource Monitoring</h3>
                    <p className="text-sm opacity-90">
                      Track CPU, memory usage, and disk space in real-time.
                    </p>
                  </div>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-left">
                    <h3 className="font-medium text-lg mb-2">Skyport Integration</h3>
                    <p className="text-sm opacity-90">
                      Seamlessly integrates with Skyport Panel for advanced management.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
