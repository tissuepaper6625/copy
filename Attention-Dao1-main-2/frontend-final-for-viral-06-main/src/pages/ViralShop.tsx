import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Heart, Percent, ExternalLink } from "lucide-react";

const ViralShop = () => {
  const merchItems = [
    {
      id: 1,
      name: "Viral Logo Hoodie",
      price: 150,
      description: "Premium hoodie with the iconic Viral logo",
      votes: 247,
      status: "Available"
    },
    {
      id: 2,
      name: "Code Warrior T-Shirt",
      price: 80,
      description: "Comfortable tee for the coding enthusiasts",
      votes: 189,
      status: "Available"
    },
    {
      id: 3,
      name: "Gaming Champion Mug",
      price: 45,
      description: "Perfect mug for your morning coffee or late-night coding",
      votes: 156,
      status: "Available"
    },
    {
      id: 4,
      name: "Network Builder Cap",
      price: 65,
      description: "Stylish cap for building connections",
      votes: 134,
      status: "Coming Soon"
    }
  ];

  const designVotes = [
    {
      id: 1,
      name: "Holographic Sticker Pack",
      description: "Set of 10 premium holographic stickers",
      votes: 423,
      proposedBy: "User_Design_Pro"
    },
    {
      id: 2,
      name: "RGB Mousepad",
      description: "Large gaming mousepad with LED edges",
      votes: 378,
      proposedBy: "TechCreator99"
    },
    {
      id: 3,
      name: "Viral Phone Case",
      description: "Protective case with gradient design",
      votes: 301,
      proposedBy: "MobileDesigner"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              ViralShop
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Exclusive merchandise you can purchase with your earned tokens
            </p>
          </div>

          {/* Special Offers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="glass-card border-green-500/20">
              <CardContent className="p-6 text-center">
                <Percent className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">30% Off First Purchase</h3>
                <p className="text-muted-foreground">
                  New to ViralShop? Get an automatic 30% discount on your very first order!
                </p>
              </CardContent>
            </Card>
            
            <Card className="glass-card border-red-500/20">
              <CardContent className="p-6 text-center">
                <ShoppingBag className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Random Discount Drops</h3>
                <p className="text-muted-foreground">
                  Stay alert for surprise flash sales and limited-time offers throughout the year!
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Available Merchandise */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Available Merchandise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {merchItems.map((item) => (
                <Card key={item.id} className="glass-card">
                  <div className="aspect-square bg-gradient-to-br from-viral-purple/20 to-viral-cyan/20 rounded-t-lg mb-4"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <Badge variant={item.status === "Available" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xl font-bold text-viral-purple">{item.price} tokens</span>
                      <div className="flex items-center space-x-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        <span className="text-sm">{item.votes}</span>
                      </div>
                    </div>
                    <Button 
                      variant={item.status === "Available" ? "viral" : "outline"} 
                      className="w-full"
                      disabled={item.status !== "Available"}
                    >
                      {item.status === "Available" ? "Purchase" : "Coming Soon"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Design Voting Section */}
          <Card className="glass-card mb-8">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Vote on New Designs</CardTitle>
              <p className="text-muted-foreground text-center">
                Help us decide what merchandise to add next to the ViralShop!
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {designVotes.map((design) => (
                  <div key={design.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{design.name}</h4>
                      <p className="text-sm text-muted-foreground">{design.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">Proposed by: {design.proposedBy}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-lg font-bold">{design.votes}</div>
                        <div className="text-xs text-muted-foreground">votes</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Heart className="w-4 h-4 mr-1" />
                        Vote
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Visit Store */}
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <ExternalLink className="w-16 h-16 text-viral-purple mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Visit the Full ViralShop</h3>
              <p className="text-muted-foreground mb-6">
                Ready to make a purchase? Visit our dedicated ViralShop portal to browse the complete catalog and complete your order.
              </p>
              <Button variant="viral" size="lg">
                Go to ViralShop Portal
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ViralShop;