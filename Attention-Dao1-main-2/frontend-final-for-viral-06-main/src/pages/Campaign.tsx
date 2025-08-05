import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Palette, Coffee, Megaphone, HandHeart, ExternalLink, Vote } from "lucide-react";

const Campaign = () => {
  const activeProjects = [
    {
      id: 1,
      title: "Design concert posters for a local indie artist",
      description: "Help emerging musician 'Luna Echo' create eye-catching promotional materials for their upcoming venue tour across the city.",
      icon: Palette,
      category: "Design",
      difficulty: "Intermediate",
      tokens: "150-300",
      donatedTokens: 450,
      donatedValue: "$450"
    },
    {
      id: 2,
      title: "Build a brand kit for a neighborhood coffee shop",
      description: "Create a complete visual identity for 'Corner Grind' - a family-owned coffee shop looking to refresh their brand and attract younger customers.",
      icon: Coffee,
      category: "Branding",
      difficulty: "Beginner",
      tokens: "200-400",
      donatedTokens: 1200,
      donatedValue: "$1,200"
    },
    {
      id: 3,
      title: "Create a social media campaign for a startup",
      description: "Develop a 30-day social media strategy for 'EcoBoxes' - a sustainable packaging startup launching their first product line.",
      icon: Megaphone,
      category: "Social Media",
      difficulty: "Advanced",
      tokens: "300-500",
      donatedTokens: 2100,
      donatedValue: "$2,100"
    },
    {
      id: 4,
      title: "Promote a fundraiser for a non-profit",
      description: "Design promotional materials and digital campaigns for 'Paws & Hearts' animal shelter's holiday adoption drive.",
      icon: HandHeart,
      category: "Non-Profit",
      difficulty: "Intermediate",
      tokens: "100-250",
      donatedTokens: 850,
      donatedValue: "$850"
    }
  ];

  const currentOutreach = {
    title: "Small Business Holiday Marketing Blitz",
    description: "This month we're focusing on helping local small businesses prepare their holiday marketing campaigns.",
    endDate: "September 30, 2025"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-viral-purple/5">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Intro Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Heart className="w-12 h-12 text-green-400" />
              <h1 className="text-5xl font-bold viral-gradient-text">
                Marketing for Good
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Marketing for Good is a monthly campaign where marketing students can vote on and contribute to 
              real-world outreach projects. These include helping small businesses, local artists, non-profits, 
              and startups with marketing tasks like branding, promotions, and design. Participants can earn 
              tokens for their work and make a meaningful impact.
            </p>
          </div>

          {/* Current Outreach Banner */}
          <div className="mb-16">
            <Card className="glass-effect border-green-400/20 bg-green-400/5">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-3">
                      <Heart className="text-green-400" />
                      Current Monthly Focus
                    </CardTitle>
                    <CardDescription className="text-lg mt-2">
                      {currentOutreach.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Ends {currentOutreach.endDate}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Active Projects List */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 viral-gradient-text">
              Active Project Ideas
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {activeProjects.map((project) => (
                <Card key={project.id} className="glass-effect border-viral-purple/20 hover:border-viral-purple/40 transition-all group">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-viral-purple/10 flex items-center justify-center group-hover:bg-viral-purple/20 transition-colors">
                          <project.icon className="w-6 h-6 text-viral-purple" />
                        </div>
                        <div>
                          <Badge variant="outline" className="text-xs mb-2">
                            {project.category}
                          </Badge>
                          <CardTitle className="text-lg leading-tight">
                            {project.title}
                          </CardTitle>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-4">
                      {project.description}
                    </CardDescription>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="text-xs">
                          {project.difficulty}
                        </Badge>
                        <div className="text-sm">
                          <span className="text-viral-purple font-medium">
                            {project.tokens} tokens
                          </span>
                          {project.donatedTokens && (
                            <div className="text-xs text-muted-foreground">
                              Donated: {project.donatedTokens} ({project.donatedValue})
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="viral-outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Voting CTA */}
          <div className="text-center">
            <Card className="glass-effect border-viral-purple/20 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center justify-center gap-3">
                  <Vote className="text-viral-purple" />
                  Shape the Future of Marketing for Good
                </CardTitle>
                <CardDescription className="text-lg">
                  Want to decide what gets worked on next? Vote on new project ideas each month!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Your voice matters in determining which causes and businesses we support. 
                    Join the monthly voting to help prioritize projects that align with our community values.
                  </p>
                  <Button variant="viral" size="lg" className="flex items-center gap-2">
                    Go Vote
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Campaign;