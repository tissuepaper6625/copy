import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Heart, ExternalLink, User } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedPosts = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "Social Media Campaign for Local Coffee Shop",
      creator: "Sarah Johnson",
      views: 2847,
      likes: 156,
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      category: "Social Media",
      postUrl: "/portfolio/post/1"
    },
    {
      id: 2,
      title: "Email Marketing Automation Strategy",
      creator: "Mike Chen",
      views: 1923,
      likes: 89,
      image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=400&h=300&fit=crop",
      category: "Email Marketing",
      postUrl: "/portfolio/post/2"
    },
    {
      id: 3,
      title: "Brand Identity Redesign Project",
      creator: "Emma Davis",
      views: 3156,
      likes: 203,
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&h=300&fit=crop",
      category: "Branding",
      postUrl: "/portfolio/post/3"
    },
    {
      id: 4,
      title: "Instagram Growth Strategy Analysis",
      creator: "Alex Rodriguez",
      views: 2134,
      likes: 142,
      image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=400&h=300&fit=crop",
      category: "Social Media",
      postUrl: "/portfolio/post/4"
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Featured{" "}
            <span className="viral-gradient bg-clip-text text-transparent">
              Portfolio Posts
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover top portfolio work from our community of talented marketing creators
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="glass-card group hover:scale-105 transition-all duration-300 overflow-hidden">
              <div className="relative">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-viral-purple/90 text-white border-none">
                    {post.category}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Link to={post.postUrl}>
                    <Button size="sm" variant="viral" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-viral-purple transition-colors">
                  {post.title}
                </h3>
                
                <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{post.creator}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span>{post.views.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/searchr">
            <Button variant="viral-outline" size="lg" className="text-lg px-8 py-4">
              View All Portfolios
            </Button>
          </Link>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-1/2 left-1/4 w-64 h-64 viral-gradient opacity-5 rounded-full blur-3xl -z-10"></div>
    </section>
  );
};

export default FeaturedPosts;