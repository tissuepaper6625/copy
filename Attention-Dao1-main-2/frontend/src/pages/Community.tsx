import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

  // Sample community posts
  const samplePosts = [
    {
      id: 1,
      name: "Sarah Chen",
      school: "UC Berkeley",
      major: "Marketing",
      role: "Senior",
      subject: "How to land your first marketing internship",
      message: "After applying to 50+ internships, here's what I learned: Focus on building a portfolio with real projects, even if they're personal or class assignments. Companies want to see your thinking process and results.",
      timestamp: "2 hours ago"
    },
    {
      id: 2,
      name: "Anonymous",
      school: "Stanford University",
      major: "",
      role: "",
      subject: "Feeling overwhelmed as a freshman - any advice?",
      message: "Starting college and feeling like everyone else has it figured out. How do you manage the workload and still have time for clubs and social life?",
      timestamp: "5 hours ago"
    },
    {
      id: 3,
      name: "Prof. Martinez",
      school: "NYU",
      major: "",
      role: "Professor",
      subject: "The importance of networking early",
      message: "Don't wait until senior year to start networking. Join professional organizations, attend virtual events, and connect with alumni. Your network is often more valuable than your GPA.",
      timestamp: "1 day ago"
    },
    {
      id: 4,
      name: "Mike Thompson",
      school: "",
      major: "Business Administration",
      role: "Recent Graduate",
      subject: "Transitioning from student to professional",
      message: "The biggest shock was realizing that real work is different from textbook scenarios. Be ready to learn continuously and don't be afraid to ask questions.",
      timestamp: "2 days ago"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-6">
              Community Hub
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connect, share knowledge, and grow together as a community of learners and professionals.
            </p>
          </div>

          {/* Senior to Freshman Section */}
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-4 glow-text">Senior to Freshman</h2>
              <p className="text-muted-foreground">
                A space for anyone—students, teachers, professionals—to ask for or share advice, experiences, and wisdom.
              </p>
            </div>

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
                        placeholder="Your name or 'Anonymous'"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input
                        id="school"
                        placeholder="Your school or university"
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
                        placeholder="e.g., Marketing, Computer Science"
                        value={formData.major}
                        onChange={(e) => handleInputChange("major", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="role">Current Role</Label>
                      <Select onValueChange={(value) => handleInputChange("role", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="freshman">Freshman</SelectItem>
                          <SelectItem value="sophomore">Sophomore</SelectItem>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="graduate">Graduate Student</SelectItem>
                          <SelectItem value="recent-grad">Recent Graduate</SelectItem>
                          <SelectItem value="professional">Professional</SelectItem>
                          <SelectItem value="teacher">Teacher/Professor</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
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

            {/* Community Posts */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Recent Community Posts</h3>
              
              {samplePosts.map((post) => (
                <Card key={post.id} className="glass-card border-viral-purple/10">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-viral-purple mb-2">
                          {post.subject}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          <span className="font-medium">
                            {post.name || "Anonymous"}
                          </span>
                          {post.school && (
                            <span>• {post.school}</span>
                          )}
                          {post.major && (
                            <span>• {post.major}</span>
                          )}
                          {post.role && (
                            <span>• {post.role}</span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {post.timestamp}
                      </span>
                    </div>
                    <p className="text-foreground leading-relaxed">
                      {post.message}
                    </p>
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