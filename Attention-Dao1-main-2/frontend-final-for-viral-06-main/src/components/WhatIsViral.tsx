import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Trophy, BookOpen, Target, Lightbulb, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const WhatIsViral = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-viral-purple" />,
      title: "Connect & Collaborate",
      description: "Join a community of marketing students, professionals, and anyone interested in the marketing field. Network with peers, mentors, and industry experts."
    },
    {
      icon: <Trophy className="w-8 h-8 text-viral-pink" />,
      title: "Compete & Earn",
      description: "Participate in prize pool competitions where you can showcase your skills, build your portfolio, and earn real money while learning."
    },
    {
      icon: <BookOpen className="w-8 h-8 text-viral-cyan" />,
      title: "Learn & Grow",
      description: "Access real-world marketing challenges, case studies, and projects that help you develop practical skills beyond the classroom."
    },
    {
      icon: <Target className="w-8 h-8 text-viral-purple" />,
      title: "Build Your Portfolio",
      description: "Create compelling marketing campaigns, analyze data, and showcase your work to potential employers and clients."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-viral-pink" />,
      title: "Share & Seek Advice",
      description: "Get guidance from seniors, professionals, and professors. Share your experiences and help others in their marketing journey."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-viral-cyan" />,
      title: "Career Advancement",
      description: "Access job opportunities, internships, and career resources tailored for marketing and adjacent fields like communications, PR, and digital media."
    }
  ];

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            What is{" "}
            <span className="viral-gradient bg-clip-text text-transparent">
              Viral?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Viral is your comprehensive platform for marketing education, networking, and career development. Whether you're a marketing major, studying communications, PR, digital media, or simply interested in the marketing field, Viral welcomes learners of all ages and backgrounds.
          </p>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to bridge the gap between academic learning and real-world marketing practice. We believe that hands-on experience, community support, and competitive challenges are the keys to building successful marketing careers. Join students, recent graduates, working professionals, and educators who are passionate about marketing and its adjacent fields.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <Card key={index} className="glass-card border-viral-purple/20 hover:border-viral-purple/40 transition-all duration-300 group">
              <CardContent className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-viral-purple transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Link to="/sign-in">
            <Button variant="viral" size="lg" className="px-8">
              Join Viral Today
            </Button>
          </Link>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-20 right-10 w-32 h-32 viral-gradient opacity-10 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-10 w-40 h-40 bg-viral-cyan opacity-5 rounded-full blur-3xl"></div>
    </section>
  );
};

export default WhatIsViral;