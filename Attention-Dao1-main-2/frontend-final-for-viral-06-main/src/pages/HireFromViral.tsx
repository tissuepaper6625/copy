import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Copy, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HireFromViral = () => {
  const [formData, setFormData] = useState({
    employerName: '',
    contactEmail: '',
    studentName: '',
    profileLink: '',
    requestDescription: ''
  });
  const { toast } = useToast();

  const uniqueLink = "https://viral.app/hire/connect";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Hiring Request Submitted",
      description: "We'll connect you with the student shortly!",
    });
    setFormData({
      employerName: '',
      contactEmail: '',
      studentName: '',
      profileLink: '',
      requestDescription: ''
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(uniqueLink);
    toast({
      title: "Link Copied",
      description: "The hiring link has been copied to your clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Hire from Viral
            </h1>
            <p className="text-lg text-muted-foreground">
              Connect with talented marketing students and build your team
            </p>
          </div>

          <div className="space-y-6">
            {/* Unique Link Section */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5" />
                  Direct Hiring Link
                </CardTitle>
                <CardDescription>
                  Share this link directly with students or include it in your communications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  <code className="flex-1 text-sm">{uniqueLink}</code>
                  <Button variant="outline" size="sm" onClick={copyLink}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Contact a Student</CardTitle>
                <CardDescription>
                  Reach out to a specific student you'd like to connect with
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="employerName">Employer Name</Label>
                    <Input
                      id="employerName"
                      value={formData.employerName}
                      onChange={(e) => setFormData(prev => ({ ...prev, employerName: e.target.value }))}
                      placeholder="Enter your name or company name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentName">Student Name</Label>
                    <Input
                      id="studentName"
                      value={formData.studentName}
                      onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                      placeholder="Enter the student's name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profileLink">Link to their Profile or Twitter</Label>
                    <Input
                      id="profileLink"
                      type="url"
                      value={formData.profileLink}
                      onChange={(e) => setFormData(prev => ({ ...prev, profileLink: e.target.value }))}
                      placeholder="https://twitter.com/username or profile link"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="requestDescription">Description of Request</Label>
                    <Textarea
                      id="requestDescription"
                      value={formData.requestDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, requestDescription: e.target.value }))}
                      placeholder="Describe the opportunity, role, or collaboration you have in mind..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Submit Hiring Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HireFromViral;