import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, PenTool, Users, Shield, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3"
            alt="About HomeShare"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About HomeShare
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            A community-driven platform reimagining home sharing through tokens
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            HomeShare is built on a simple idea: create a fair, transparent, and community-owned platform 
            for sharing homes around the world.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h3 className="text-2xl font-semibold mb-4">The Problem</h3>
            <p className="text-muted-foreground mb-4">
              Traditional home-sharing platforms extract significant value from hosts and guests 
              through high fees, while offering little ownership or governance to the community 
              that makes them valuable.
            </p>
            <p className="text-muted-foreground">
              These platforms often prioritize profit over community, leading to issues with 
              trust, quality, and long-term sustainability.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-semibold mb-4">Our Solution</h3>
            <p className="text-muted-foreground mb-4">
              HomeShare introduces a token-based system that rewards participation and 
              contribution to the network. Hosts earn tokens by sharing their homes, while 
              guests can use tokens to book stays.
            </p>
            <p className="text-muted-foreground">
              The community collectively governs the platform, ensuring that decisions 
              benefit all participants rather than extracting value for shareholders.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">How HomeShare Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <PenTool className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Earn Tokens</h3>
                  <p className="text-muted-foreground">
                    Hosts earn tokens by sharing their homes, providing great experiences, 
                    and contributing to the community.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Book Stays</h3>
                  <p className="text-muted-foreground">
                    Use tokens to book stays around the world with minimal fees, 
                    creating a peer-to-peer exchange of value.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="text-center mb-4">
                  <div className="bg-primary/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Govern Together</h3>
                  <p className="text-muted-foreground">
                    Token holders participate in platform governance, voting on 
                    features, policies, and the future direction.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Community Ownership</h3>
              <p className="text-muted-foreground">
                We believe that those who create value should own and govern the platform. 
                HomeShare is designed to be community-owned from day one.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Trust & Safety</h3>
              <p className="text-muted-foreground">
                Our reputation system and community governance ensure high standards 
                of quality, safety, and trust for all participants.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Global Access</h3>
              <p className="text-muted-foreground">
                We're building a platform that works for everyone, everywhere, 
                with minimal barriers to entry and participation.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="bg-primary/10 h-12 w-12 rounded-full flex items-center justify-center">
                <PenTool className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Fair Value Exchange</h3>
              <p className="text-muted-foreground">
                Our token system ensures that value flows directly between hosts and guests, 
                with minimal extraction by intermediaries.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you're looking to share your home or find your next stay, 
            HomeShare offers a new way to participate in the sharing economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/">Explore Homes</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent" asChild>
              <Link href="/community">Meet Our Hosts</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}