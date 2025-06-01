import { authMiddleware, redirectToSignIn, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: [
    "/",
    "/explore",
    "/community",
    "/community/(.*)",
    "/about",
    "/api/listings(.*)",
    "/api/hosts(.*)",
    "/listing/(.*)",
    "/api/webhooks/(.*)",
  ],
  
  // Routes that can be accessed by authenticated users or redirected to sign-in
  async afterAuth(auth, req) {
    // If the user is not signed in and the route is not public, redirect to sign-in
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    
    // If the user is signed in
    if (auth.userId) {
      // Allow access to the onboarding page always
      if (req.nextUrl.pathname === '/onboarding') {
        return NextResponse.next();
      }
      
      // Check if the user has completed onboarding
      try {
        // Get user metadata from Clerk
        const user = await clerkClient.users.getUser(auth.userId);
        const hasCompletedOnboarding = user.unsafeMetadata?.onboardingComplete === true;
        
        // If onboarding is not complete and not on the onboarding page, redirect to onboarding
        if (!hasCompletedOnboarding && 
            !req.nextUrl.pathname.startsWith('/api/') && 
            req.nextUrl.pathname !== '/onboarding') {
          return NextResponse.redirect(new URL('/onboarding', req.url));
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        // In case of error, allow access to avoid blocking users
      }
      
      // For all other cases, allow access to protected routes
      return NextResponse.next();
    }
    
    // Allow access to public routes
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
