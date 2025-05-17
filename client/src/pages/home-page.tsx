import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "@shared/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HomePage() {
  const { user } = useAuth();
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const dashboardName = settings?.dashboardName || "MinePanel";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold">
                {dashboardName.split(/(?=[A-Z])/).map((part, i) => (
                  <span key={i} className={i % 2 ? "text-primary" : ""}>
                    {part}
                  </span>
                ))}
              </span>
            </div>
            <div>
              {user ? (
                <Link href="/dashboard">
                  <Button className="ml-4">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <Link href="/auth">
                    <Button variant="outline">Log in</Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button>Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <main>
        <div className="relative pt-16 pb-32 overflow-hidden">
          <div className="relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
                  <span className="block">Manage your Minecraft</span>
                  <span className="block text-primary">servers with ease</span>
                </h1>
                <p className="mt-6 text-xl text-gray-500 dark:text-gray-400">
                  {dashboardName} provides a powerful, intuitive dashboard for managing your Minecraft servers powered by Skyport Panel.
                </p>
                <div className="mt-10 flex justify-center">
                  <div className="rounded-md shadow">
                    <Link href={user ? "/dashboard" : "/auth?tab=register"}>
                      <Button size="lg" className="px-8">
                        {user ? "Go to Dashboard" : "Get Started"}
                      </Button>
                    </Link>
                  </div>
                  <div className="ml-3">
                    <Link href="/auth">
                      <Button variant="outline" size="lg" className="px-8">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature section */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Powerful features for server management
              </h2>
              <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
                Everything you need to manage and monitor your Minecraft servers.
              </p>
            </div>

            <div className="mt-16">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="pt-6">
                  <div className="flow-root bg-gray-50 dark:bg-gray-900 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                          <FontAwesomeIcon icon="server" className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Server Management</h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        Start, stop, and restart your Minecraft servers with a single click. Monitor resource usage in real-time.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 dark:bg-gray-900 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                          <FontAwesomeIcon icon="users" className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Player Management</h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        View online players, manage permissions, and track player activity across all of your servers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <div className="flow-root bg-gray-50 dark:bg-gray-900 rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                          <FontAwesomeIcon icon="cog" className="h-6 w-6 text-white" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 dark:text-white">Advanced Configuration</h3>
                      <p className="mt-5 text-base text-gray-500 dark:text-gray-400">
                        Edit server configuration files, install plugins, and customize your server settings all from one place.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-gray-400">
                &copy; {new Date().getFullYear()} {dashboardName}. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
