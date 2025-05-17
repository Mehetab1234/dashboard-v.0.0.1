import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Badge } from "@/components/ui/badge";

export function Header({ 
  onMenuClick 
}: { 
  onMenuClick: () => void
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logoutMutation } = useAuth();
  const [, setLocation] = useLocation();

  const userInitials = user?.username
    ? user.username.substring(0, 2).toUpperCase()
    : "U";

  const avatarUrl = user?.discordAvatar
    ? `https://cdn.discordapp.com/avatars/${user.discordId}/${user.discordAvatar}.png`
    : null;

  const handleLogout = () => {
    logoutMutation.mutate();
    setLocation("/");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality here
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow z-10">
      <div className="flex h-16 items-center px-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden mr-2" 
          onClick={onMenuClick}
        >
          <FontAwesomeIcon icon="bars" />
          <span className="sr-only">Open menu</span>
        </Button>
        
        <form onSubmit={handleSearchSubmit} className="flex-1 md:flex-initial md:w-72 mr-4">
          <div className="relative">
            <FontAwesomeIcon icon="search" className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8 rounded-md border-gray-300 dark:border-gray-700"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <FontAwesomeIcon icon="bell" className="h-4 w-4" />
            <Badge className="absolute top-0 right-0 h-2 w-2 p-0 translate-x-1/2 -translate-y-1/2" variant="destructive" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar>
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback>{userInitials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.username}</p>
                  {user?.email && (
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => setLocation("/dashboard")}
              >
                Dashboard
              </DropdownMenuItem>
              {user?.isAdmin && (
                <DropdownMenuItem 
                  onClick={() => setLocation("/admin")}
                >
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
