'use client';

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
import { Home, Menu, User, Settings, PenTool, LayoutDashboard } from 'lucide-react';
import { useUser, useClerk, SignInButton, SignUpButton } from '@clerk/nextjs';

export function Header() {
  const pathname = usePathname();
  const { user, isSignedIn, isLoaded } = useUser();
  const { signOut } = useClerk();
  
  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center px-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Home className="h-5 w-5 text-primary" />
          <span>HomeShare</span>
        </Link>

        <nav className="mx-6 hidden md:flex items-center space-x-4 lg:space-x-6">
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
          {isSignedIn && (
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

        <div className="flex items-center gap-4 ml-auto">
          {isLoaded && isSignedIn ? (
            <>
              {user?.publicMetadata?.tokens && typeof user.publicMetadata.tokens === 'number' && (
                <div className="hidden md:flex items-center gap-2">
                  <PenTool className="h-4 w-4 text-primary" />
                  <span className="font-medium">{user.publicMetadata.tokens} tokens</span>
                </div>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl} alt={user?.fullName || ''} />
                      <AvatarFallback>{user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user?.fullName || user?.emailAddresses[0]?.emailAddress}</p>
                      {user?.publicMetadata?.tokens && typeof user.publicMetadata.tokens === 'number' ? (
                        <p className="text-sm text-muted-foreground flex items-center">
                          <PenTool className="h-3 w-3 mr-1" />
                          {user.publicMetadata.tokens} tokens
                        </p>
                      ) : null}
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
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2 h-4 w-4"
                    >
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                      <polyline points="16 17 21 12 16 7"></polyline>
                      <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <SignInButton>
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button size="sm">Sign Up</Button>
              </SignUpButton>
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
              {isSignedIn && (
                <DropdownMenuItem asChild>
                  <Link href="/dashboard" className="cursor-pointer flex w-full">Dashboard</Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
