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

  const dashboardName = settings?.dashboardName || "CrazeDash";

  // Redirect to dashboard if already logged in
  if (user && !isLoading) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen minecraft-bg flex flex-col">
      {/* Floating Minecraft Blocks */}
      <div className="floating-block dirt" style={{ top: '15%', left: '10%', animationDelay: '0s' }}></div>
      <div className="floating-block grass" style={{ top: '60%', left: '15%', animationDelay: '1s' }}></div>
      <div className="floating-block stone" style={{ top: '25%', right: '15%', animationDelay: '2s' }}></div>
      <div className="floating-block diamond" style={{ top: '70%', right: '20%', animationDelay: '1.5s' }}></div>
      <div className="floating-block grass" style={{ top: '40%', left: '40%', animationDelay: '2.2s' }}></div>
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center flex-1 relative z-10">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-white font-bold minecraft-text">Loading...</p>
        </div>
      ) : (
        <div className="flex flex-1 md:grid md:grid-cols-2 relative z-10">
          {/* Form side */}
          <div className="w-full flex items-center justify-center p-8">
            <AuthForms />
          </div>

          {/* Information side */}
          <div className="hidden md:block">
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6 minecraft-text text-white animate-pulse-slow">
                  Welcome to {dashboardName}
                </h1>
                <p className="text-xl mb-8 text-white">
                  Manage your Minecraft servers with ease, monitor performance,
                  and keep your players happy.
                </p>

                <div className="grid grid-cols-1 gap-4 mt-12">
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 text-left pixel-border animate-fadein delay-100">
                    <h3 className="font-medium text-lg mb-2 text-primary minecraft-text">Server Management</h3>
                    <p className="text-sm text-white">
                      Start, stop, and restart your Minecraft servers with a single click.
                    </p>
                  </div>
                  
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 text-left pixel-border animate-fadein delay-200">
                    <h3 className="font-medium text-lg mb-2 text-primary minecraft-text">Resource Monitoring</h3>
                    <p className="text-sm text-white">
                      Track CPU, memory usage, and disk space in real-time.
                    </p>
                  </div>
                  
                  <div className="bg-black/60 backdrop-blur-sm rounded-lg p-6 text-left pixel-border animate-fadein delay-300">
                    <h3 className="font-medium text-lg mb-2 text-primary minecraft-text">Create Servers</h3>
                    <p className="text-sm text-white">
                      Create and manage your custom Minecraft servers in just a few clicks.
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
