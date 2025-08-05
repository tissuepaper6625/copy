import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Quote, Users, Trophy, Target, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Marketing Intern at Meta",
      quote: "Viral helped me build a portfolio that actually got me noticed. The collaborative challenges pushed me to create content I never thought I could!",
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Brand Manager at Nike",
      quote: "The community aspect is incredible. I've made lifelong connections while earning tokens for my creative work.",
      avatar: "MR"
    },
    {
      name: "Emily Johnson",
      role: "Digital Marketing Specialist",
      quote: "Going from zero portfolio to landing my dream job in 6 months - Viral made it possible through real project experience.",
      avatar: "EJ"
    }
  ];

  const highlights = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Active Community",
      description: "Connect with 10,000+ marketing students worldwide"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Real Rewards",
      description: "Earn tokens for quality work that converts to real money"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Portfolio Focus",
      description: "Challenges designed to build impressive portfolio pieces"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Career Growth",
      description: "Skills and connections that accelerate your marketing career"
    }
  ];

  const benefits = [
    "Build portfolio pieces that employers actually want to see",
    "Collaborate with talented marketing students globally",
    "Earn tokens while developing your skills",
    "Access to exclusive industry mentorship",
    "Real-world project experience",
    "Network with future marketing leaders"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="glass-card border-viral-purple/20 p-8 mb-8">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 viral-gradient bg-clip-text text-transparent">
                About Viral
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
                For marketing jobs, your portfolio can matter to employers more than your resume!
              </p>
            </Card>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="glass-card border-viral-purple/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h2 className="text-3xl font-bold mb-6 text-viral-purple">The Portfolio Advantage</h2>
                    <p className="text-lg text-muted-foreground mb-6">
                      According to Hiraation.com, <strong className="text-foreground">"More than 72% of employers say a portfolio can sway their hiring decision and nearly 60% actively prefer it over a resume alone"</strong>.
                    </p>
                    <p className="text-lg text-muted-foreground">
                      Building this portfolio can be challenging and boring! Viral lets you create opportunities amongst other students just like you, while getting rewarded! Collaborate, challenge and grow your career and skillset in marketing today!
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="glass-card border-viral-purple/30 p-4 text-center">
                      <div className="text-4xl font-bold text-viral-purple mb-2">72%</div>
                      <div className="text-sm text-muted-foreground">Employers influenced by portfolios</div>
                    </Card>
                    <Card className="glass-card border-viral-pink/30 p-4 text-center">
                      <div className="text-4xl font-bold text-viral-pink mb-2">60%</div>
                      <div className="text-sm text-muted-foreground">Prefer portfolios over resumes</div>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <Card className="glass-card border-viral-purple/20 p-8 mb-8">
              <h2 className="text-3xl font-bold text-center mb-8">Why Choose Viral?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {highlights.map((highlight, index) => (
                  <Card key={index} className="glass-card border-viral-purple/20 hover:border-viral-pink/40 transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="text-viral-purple mb-4 flex justify-center">
                        {highlight.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{highlight.title}</h3>
                      <p className="text-muted-foreground">{highlight.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl">
            <Card className="glass-card border-viral-purple/20 p-8 bg-gradient-to-br from-viral-purple/5 to-viral-pink/5">
              <h2 className="text-3xl font-bold text-center mb-8">What You'll Gain</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors">
                    <CheckCircle className="w-6 h-6 text-viral-purple flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">What Our Community Says</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="glass-card border-viral-purple/20">
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 text-viral-purple mb-4" />
                    <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-viral-gradient flex items-center justify-center text-white font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <Card className="glass-card border-viral-purple/20 p-8 bg-gradient-to-br from-viral-purple/10 to-viral-pink/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Marketing Career?
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of marketing students already building their future
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/sign-in">
                  <Button size="lg" className="viral-gradient text-white px-8 py-3 text-lg hover:scale-105 transition-transform">
                    Get Started Today
                  </Button>
                </Link>
                <Link to="/how-to-use-tokens">
                  <Button variant="outline" size="lg">
                    How To Use Tokens
                  </Button>
                </Link>
                <Link to="/how-to-earn-tokens">
                  <Button variant="outline" size="lg">
                    How To Earn Tokens
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;