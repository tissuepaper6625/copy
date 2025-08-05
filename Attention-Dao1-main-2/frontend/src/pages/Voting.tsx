import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vote, Trophy, Heart, Users, ExternalLink } from "lucide-react";

const Voting = () => {
  const proposalCategories = [
    {
      title: "Marketing for Good",
      description: "Anyone can vote",
      icon: Heart,
      color: "text-green-400",
      proposals: [
        {
          id: "MFG-001",
          title: "Fund Climate Change Awareness Campaign",
          author: "EcoWarrior",
          description: "Proposal to allocate 50,000 tokens for a climate awareness social media campaign targeting Gen Z.",
          votes: 2847,
          ends: "2 days",
          snapshotLink: "#"
        },
        {
          id: "MFG-002", 
          title: "Mental Health Support Initiative",
          author: "MindfulMarketer",
          description: "Create a mental health resource hub and fund content creators promoting mental wellness.",
          votes: 1923,
          ends: "5 days",
          snapshotLink: "#"
        }
      ]
    },
    {
      title: "DAO Governance",
      description: "Users with 100+ tokens",
      icon: Vote,
      color: "text-viral-purple",
      proposals: [
        {
          id: "GOV-001",
          title: "Update Token Distribution Model",
          author: "TokenMaster",
          description: "Propose changes to the token reward structure for creators and game participants.",
          votes: 1456,
          ends: "3 days",
          snapshotLink: "#"
        },
        {
          id: "GOV-002",
          title: "New Partnership Framework",
          author: "PartnershipLead",
          description: "Establish guidelines for brand partnerships and revenue sharing with the community.",
          votes: 987,
          ends: "1 week",
          snapshotLink: "#"
        }
      ]
    },
    {
      title: "Weekly Games",
      description: "Game creators with 100+ avg users",
      icon: Trophy,
      color: "text-viral-pink",
      proposals: [
        {
          id: "GAME-001",
          title: "Increase Prize Pool for Video Challenges",
          author: "VideoGamePro",
          description: "Proposal to increase the prize pool for video creation challenges from 1,000 to 2,500 tokens.",
          votes: 743,
          ends: "4 days",
          snapshotLink: "#"
        },
        {
          id: "GAME-002",
          title: "New Category: Micro-Influencer Games",
          author: "MicroInfluencer",
          description: "Create a new game category specifically for creators with 1K-10K followers.",
          votes: 521,
          ends: "6 days",
          snapshotLink: "#"
        }
      ]
    }
  ];

  const quadraticExamples = [
    { tokens: 1, votes: 1 },
    { tokens: 4, votes: 2 },
    { tokens: 9, votes: 3 },
    { tokens: 16, votes: 4 },
    { tokens: 25, votes: 5 },
    { tokens: 100, votes: 10 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-viral-purple/5">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-6 viral-gradient-text">
              How Voting Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Viral DAO uses quadratic voting to ensure fair representation and prevent vote buying.
            </p>
          </div>

          {/* Quadratic Voting Explanation */}
          <div className="mb-16">
            <Card className="glass-effect border-viral-purple/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-3">
                  <Vote className="text-viral-purple" />
                  Quadratic Voting System
                </CardTitle>
                <CardDescription className="text-lg">
                  The cost of votes increases quadratically: X² tokens = X votes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {quadraticExamples.map((example, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-viral-purple/10 border border-viral-purple/20">
                      <div className="text-2xl font-bold text-viral-purple">{example.tokens}</div>
                      <div className="text-sm text-muted-foreground">tokens</div>
                      <div className="text-lg font-semibold mt-2">{example.votes}</div>
                      <div className="text-sm text-muted-foreground">vote{example.votes !== 1 ? 's' : ''}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Who Can Vote */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8 viral-gradient-text">Who Can Vote</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {proposalCategories.map((category, index) => (
                <Card key={index} className="glass-effect border-viral-purple/20 hover:border-viral-purple/40 transition-all">
                  <CardHeader className="text-center">
                    <category.icon className={`w-12 h-12 mx-auto mb-4 ${category.color}`} />
                    <CardTitle className="text-xl">{category.title}</CardTitle>
                    <CardDescription className="text-lg font-medium">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Voting */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12 viral-gradient-text">Active Voting</h2>
            
            {proposalCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <category.icon className={`w-8 h-8 ${category.color}`} />
                  <h3 className="text-2xl font-bold">{category.title}</h3>
                  <Badge variant="outline" className="border-viral-purple/40 text-viral-purple">
                    {category.description}
                  </Badge>
                </div>
                
                <div className="grid gap-6">
                  {category.proposals.map((proposal, proposalIndex) => (
                    <Card key={proposalIndex} className="glass-effect border-viral-purple/20 hover:border-viral-purple/40 transition-all">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {proposal.id}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                by {proposal.author}
                              </span>
                            </div>
                            <CardTitle className="text-xl mb-2">{proposal.title}</CardTitle>
                            <CardDescription className="text-base">
                              {proposal.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-viral-purple" />
                              <span className="font-semibold">{proposal.votes.toLocaleString()}</span>
                              <span className="text-sm text-muted-foreground">votes</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Ends in {proposal.ends}
                            </div>
                          </div>
                          <Button variant="viral" className="flex items-center gap-2">
                            Go Vote
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Voting;