import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, MessageCircle, HelpCircle, Users, Briefcase, Trophy } from "lucide-react";

const Footer = () => {
  const footerLinks = [
    {
      title: "Get Involved",
      links: [
        { href: "/partner", label: "Partner with Us", icon: Briefcase },
        { href: "/hire", label: "Hire from Viral", icon: Users },
        { href: "/host-game", label: "Host a Game", icon: Trophy },
      ],
    },
    {
      title: "Support",
      links: [
        { href: "/faq", label: "FAQ", icon: HelpCircle },
        { href: "/contact", label: "Contact", icon: Mail },
      ],
    },
  ];

  return (
    <footer className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="absolute inset-0 glass-card border-t border-border/20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 viral-gradient rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">V</span>
              </div>
              <span className="text-2xl font-bold glow-text">Viral</span>
            </div>
            <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
              The premier DAO community for marketing students to network, compete, learn, and earn while building their careers in the digital marketing space.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="viral" className="flex items-center">
                Join the Community
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button variant="viral-outline" className="flex items-center">
                <MessageCircle className="mr-2 w-4 h-4" />
                Discord
              </Button>
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-6 text-viral-purple">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link, linkIndex) => {
                  const Icon = link.icon;
                  return (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="flex items-center text-muted-foreground hover:text-viral-purple transition-colors duration-300 group"
                      >
                        <Icon className="w-4 h-4 mr-3 group-hover:text-viral-pink transition-colors" />
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="glass-card p-8 rounded-2xl mb-12">
          <div className="text-center md:text-left md:flex md:items-center md:justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold mb-2">Stay in the Loop</h3>
              <p className="text-muted-foreground">
                Get the latest updates on new games, opportunities, and community highlights
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:min-w-96">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-viral-purple"
              />
              <Button variant="viral" className="px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-muted-foreground text-sm">
              © 2024 Viral DAO. All rights reserved. Built for marketing students, by marketing students.
            </div>
            <div className="flex items-center gap-6">
              <a href="/privacy" className="text-muted-foreground hover:text-viral-purple transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-muted-foreground hover:text-viral-purple transition-colors text-sm">
                Terms of Service
              </a>
              <a href="/cookies" className="text-muted-foreground hover:text-viral-purple transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decorations */}
      <div className="absolute bottom-0 left-1/4 w-64 h-64 viral-gradient opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-1/4 w-48 h-48 bg-viral-cyan opacity-5 rounded-full blur-2xl"></div>
    </footer>
  );
};

export default Footer;