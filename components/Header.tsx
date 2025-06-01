'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Home, Menu, LogIn, LogOut, User, Settings, PenTool, LayoutDashboard } from 'lucide-react';

export function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  
  // Mock user data - in a real app, this would come from auth context
  const user = {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    tokens: 250
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <header className="border-b sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 mx-12 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            <span className="font-bold text-xl">HomeShare</span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Home
          </Link>
          <Link 
            href="/explore" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/explore' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Explore
          </Link>
          <Link 
            href="/community" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/community' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Community
          </Link>
          <Link 
            href="/about" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === '/about' ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            About
          </Link>
          {isLoggedIn && (
            <Link 
              href="/dashboard/listings" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname.startsWith('/dashboard') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              My Listings
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <PenTool className="h-4 w-4 text-primary" />
                <span className="font-medium">{user.tokens} tokens</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <PenTool className="h-3 w-3 mr-1" />
                        {user.tokens} tokens
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer flex w-full items-center">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/listings" className="cursor-pointer flex w-full items-center">
                      <Home className="mr-2 h-4 w-4" />
                      <span>My Listings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer flex w-full items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer flex w-full items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogin}>
                <LogIn className="mr-2 h-4 w-4" />
                Log in
              </Button>
              <Button size="sm">Sign up</Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer flex w-full">Home</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/explore" className="cursor-pointer flex w-full">Explore</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/community" className="cursor-pointer flex w-full">Community</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/about" className="cursor-pointer flex w-full">About</Link>
              </DropdownMenuItem>
              {isLoggedIn && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/listings" className="cursor-pointer flex w-full">My Listings</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
