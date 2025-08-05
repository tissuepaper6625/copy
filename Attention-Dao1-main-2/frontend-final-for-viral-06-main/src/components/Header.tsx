import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mainNavLinks = [
    { href: "/about", label: "About" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/voting", label: "Voting" },
    { href: "/prize-pool-games", label: "Prize Pool Games" },
    { href: "/campaign", label: "Campaign" },
    { href: "/community", label: "Community" },
    { href: "/network", label: "Network" },
  ];

  const allNavLinks = [
    ...mainNavLinks,
    { href: "/my-portfolio", label: "MyPortfolio" },
    { href: "/account", label: "Account" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 viral-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
            <span className="text-xl font-bold glow-text">Viral</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-viral-purple transition-colors p-0 h-auto font-medium text-sm">
                  About <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border">
                <DropdownMenuItem asChild><Link to="/about" className="w-full">About</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/use-tokens" className="w-full">Use Tokens</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/earn-tokens" className="w-full">Earn Tokens</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/viralshop" className="w-full">ViralShop</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/leaderboard" className="text-muted-foreground hover:text-viral-purple transition-colors duration-300 font-medium text-sm">Leaderboard</Link>
            <Link to="/voting" className="text-muted-foreground hover:text-viral-purple transition-colors duration-300 font-medium text-sm">Voting</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-viral-purple transition-colors p-0 h-auto font-medium text-sm">
                  Prize Pool Games <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border">
                <DropdownMenuItem asChild><Link to="/prize-pool-games" className="w-full">Prize Pool Games</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/game-rules" className="w-full">Rules of Prize Pool Games</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/post-game" className="w-full">Post a Game</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/game-results" className="w-full">Game Results</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/game-creator" className="w-full">Game Creator</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/campaign" className="text-muted-foreground hover:text-viral-purple transition-colors duration-300 font-medium text-sm">Campaign</Link>
            <Link to="/community" className="text-muted-foreground hover:text-viral-purple transition-colors duration-300 font-medium text-sm">Community</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-viral-purple transition-colors p-0 h-auto font-medium text-sm">
                  Network <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border">
                <DropdownMenuItem asChild><Link to="/network" className="w-full">Network</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/messages" className="w-full">Messages</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/inbox" className="w-full">Inbox</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-viral-purple transition-colors p-0 h-auto font-medium text-sm">
                  MyPortfolio <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-background border border-border">
                <DropdownMenuItem asChild><Link to="/my-portfolio" className="w-full">My Portfolio</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/create-post" className="w-full">Create a Post</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/searchr" className="text-muted-foreground hover:text-viral-purple transition-colors duration-300 font-medium text-sm">Search</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground hover:text-viral-purple transition-colors p-0 h-auto font-medium text-sm">
                  Account <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border border-border">
                <DropdownMenuItem asChild><Link to="/account" className="w-full">Account</Link></DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Get Started Button */}
          <div className="hidden md:block">
            <Link to="/sign-in">
              <Button variant="viral" size="lg">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/20">
            <nav className="flex flex-col space-y-4">
              {allNavLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-muted-foreground hover:text-viral-purple transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4">
                <Link to="/sign-in">
                  <Button variant="viral" size="lg" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;