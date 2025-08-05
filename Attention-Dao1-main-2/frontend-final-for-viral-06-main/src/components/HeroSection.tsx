import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Users, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg-new.jpg";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Hero Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 hero-gradient" />
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-16 h-16 viral-gradient rounded-full opacity-20 blur-sm"></div>
      </div>
      <div className="absolute top-40 right-20 animate-float delay-1000">
        <div className="w-12 h-12 bg-viral-pink rounded-full opacity-30 blur-sm"></div>
      </div>
      <div className="absolute bottom-40 left-20 animate-float delay-2000">
        <div className="w-20 h-20 bg-viral-cyan rounded-full opacity-15 blur-md"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">
            Make Money, Soar Your Career!
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Your student marketing community is here!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link to="/sign-in">
              <Button variant="viral" size="lg" className="text-lg px-8 py-4">
                Get Started
                <ArrowRight className="ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="viral-outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </Link>
          </div>

          {/* Feature Icons */}
          <div className="flex justify-center items-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mb-3 mx-auto">
                <TrendingUp className="w-8 h-8 text-viral-purple" />
              </div>
              <p className="text-sm text-muted-foreground">Viral Growth</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mb-3 mx-auto">
                <Users className="w-8 h-8 text-viral-pink" />
              </div>
              <p className="text-sm text-muted-foreground">Community</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 glass-card rounded-full flex items-center justify-center mb-3 mx-auto">
                <Zap className="w-8 h-8 text-viral-cyan" />
              </div>
              <p className="text-sm text-muted-foreground">Rewards</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;