import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Heart, Search } from "lucide-react";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Community = () => {
  const [formData, setFormData] = useState({
    name: "",
    school: "",
    major: "",
    role: "",
    subject: "",
    message: ""
  });

  const [searchQuery, setSearchQuery] = useState("");

  // Sample community posts with responses
  const samplePosts = [
    {
      id: 1,
      name: "Sarah Chen",
      school: "UC Berkeley - Senior",
      major: "Marketing",
      role: "Senior",
      subject: "How to land your first marketing internship",
      message: "After applying to 50+ internships, here's what I learned: Focus on building a portfolio with real projects, even if they're personal or class assignments. Companies want to see your thinking process and results.",
      timestamp: "2 hours ago",
      likes: 15,
      responses: [
        {
          id: 1,
          name: "Marcus J.",
          role: "Junior",
          message: "This is so helpful! I'm working on my portfolio now. Any specific platforms you recommend for showcasing work?",
          timestamp: "1 hour ago"
        },
        {
          id: 2,
          name: "Prof. Williams",
          role: "Professor",
          message: "Sarah's advice is spot on. I review many internship applications and portfolios definitely stand out more than GPAs.",
          timestamp: "45 minutes ago"
        }
      ]
    },
    {
      id: 2,
      name: "Anonymous",
      school: "Stanford University - Freshman",
      major: "",
      role: "Freshman",
      subject: "Feeling overwhelmed as a freshman - any advice?",
      message: "Starting college and feeling like everyone else has it figured out. How do you manage the workload and still have time for clubs and social life?",
      timestamp: "5 hours ago",
      likes: 8,
      responses: [
        {
          id: 1,
          name: "Emma T.",
          role: "Sophomore",
          message: "You're not alone! Everyone feels this way freshman year. Start with time blocking - schedule everything including downtime. It gets easier!",
          timestamp: "3 hours ago"
        },
        {
          id: 2,
          name: "Alex Rodriguez",
          role: "Junior",
          message: "I felt the same way! Join one club that really interests you first, don't try to do everything at once. Quality over quantity.",
          timestamp: "2 hours ago"
        }
      ]
    },
    {
      id: 3,
      name: "Prof. Martinez",
      school: "NYU",
      major: "",
      role: "Professor",
      subject: "The importance of networking early",
      message: "Don't wait until senior year to start networking. Join professional organizations, attend virtual events, and connect with alumni. Your network is often more valuable than your GPA.",
      timestamp: "1 day ago",
      likes: 23,
      responses: [
        {
          id: 1,
          name: "David Park",
          role: "Junior",
          message: "Thank you for this! I joined AMA last month and already made 3 valuable connections. LinkedIn has been a game changer.",
          timestamp: "18 hours ago"
        },
        {
          id: 2,
          name: "Lisa Kim", 
          role: "Recent Graduate",
          message: "100% agree! My current job came through an alumni connection, not a job board.",
          timestamp: "12 hours ago"
        }
      ]
    },
    {
      id: 4,
      name: "Mike Thompson",
      school: "USC - Recent Graduate",
      major: "Business Administration",
      role: "Recent Graduate",
      subject: "Transitioning from student to professional",
      message: "The biggest shock was realizing that real work is different from textbook scenarios. Be ready to learn continuously and don't be afraid to ask questions.",
      timestamp: "2 days ago",
      likes: 12,
      responses: []
    },
    {
      id: 5,
      name: "Anonymous",
      school: "Community College - Sophomore",
      major: "Marketing",
      role: "Transfer Student",
      subject: "Transferring to a 4-year university - tips needed",
      message: "Planning to transfer next year and feeling nervous about the application process. Any advice on what admissions committees look for in transfer students?",
      timestamp: "3 days ago",
      likes: 7,
      responses: [
        {
          id: 1,
          name: "Rachel Kim",
          role: "Transfer Advisor",
          message: "Focus on your story - why you want to transfer and how your current experience has prepared you. Strong essays matter more than perfect grades.",
          timestamp: "2 days ago"
        }
      ]
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      name: "",
      school: "",
      major: "",
      role: "",
      subject: "",
      message: ""
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filter posts based on search query
  const filteredPosts = samplePosts.filter(post => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      post.subject.toLowerCase().includes(searchLower) ||
      post.message.toLowerCase().includes(searchLower) ||
      (post.name && post.name.toLowerCase().includes(searchLower)) ||
      (post.school && post.school.toLowerCase().includes(searchLower)) ||
      (post.major && post.major.toLowerCase().includes(searchLower)) ||
      (post.role && post.role.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-black font-playfair viral-gradient bg-clip-text text-transparent mb-6 tracking-wide">
              Senior to Freshman
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A space for anyone—students, teachers, professionals—to ask for or share advice, experiences, and wisdom.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Form Section */}
            <Card className="glass-card border-viral-purple/20 mb-12">
              <CardHeader>
                <CardTitle className="text-2xl">Share Your Wisdom or Ask for Advice</CardTitle>
                <CardDescription>
                  All fields are optional. Feel free to post anonymously or share as much as you're comfortable with.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        placeholder="Your name or leave blank for 'Anonymous'"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School and School Year</Label>
                      <Input
                        id="school"
                        placeholder="e.g., UC Berkeley - Senior, Community College - Sophomore"
                        value={formData.school}
                        onChange={(e) => handleInputChange("school", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="major">Major or Field of Study</Label>
                      <Input
                        id="major"
                        placeholder="e.g., Marketing, Computer Science, Business"
                        value={formData.major}
                        onChange={(e) => handleInputChange("major", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Current Role</Label>
                      <Input
                        id="role"
                        placeholder="e.g., Student, Teacher, Professional, Recent Graduate"
                        value={formData.role}
                        onChange={(e) => handleInputChange("role", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="Title of your advice or question"
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Share your advice, ask your question, or tell your story..."
                      className="min-h-[120px]"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      required
                    />
                  </div>

                  <Button type="submit" variant="viral" size="lg" className="w-full">
                    Post to Community
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Search Section */}
            <Card className="glass-card border-viral-purple/20 mb-8">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search posts by keywords, name, school, major..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Community Posts */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Recent Community Posts ({filteredPosts.length})</h3>
              
              {filteredPosts.map((post) => (
                <Card key={post.id} className="glass-card border-viral-purple/10">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-viral-purple mb-2">
                          {post.subject}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-2">
                          <span className="font-medium">
                            {post.name || "Anonymous"}
                          </span>
                          {post.school && (
                            <Badge variant="outline" className="text-xs">
                              {post.school}
                            </Badge>
                          )}
                          {post.major && (
                            <Badge variant="outline" className="text-xs">
                              {post.major}
                            </Badge>
                          )}
                          {post.role && (
                            <Badge variant="secondary" className="text-xs">
                              {post.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {post.timestamp}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed mb-4">
                      {post.message}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center gap-4 pb-4 border-b border-border/20">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-viral-purple">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-viral-purple">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        {post.responses.length} responses
                      </Button>
                    </div>

                    {/* Responses */}
                    {post.responses.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {post.responses.map((response) => (
                          <div key={response.id} className="pl-4 border-l-2 border-viral-purple/20">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium">{response.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {response.role}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {response.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {response.message}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Community;