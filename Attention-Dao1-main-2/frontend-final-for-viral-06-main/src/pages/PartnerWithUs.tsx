import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PartnerWithUs = () => {
  const [formData, setFormData] = useState({
    brandName: '',
    contactEmail: '',
    partnershipType: '',
    otherDescription: '',
    requestDescription: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Partnership Request Submitted",
      description: "We'll get back to you within 2-3 business days!",
    });
    setFormData({
      brandName: '',
      contactEmail: '',
      partnershipType: '',
      otherDescription: '',
      requestDescription: ''
    });
  };

  const handlePartnershipTypeChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      partnershipType: value,
      otherDescription: value !== 'other' ? '' : prev.otherDescription
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Partner with Viral
            </h1>
            <p className="text-lg text-muted-foreground">
              Join forces with us to create engaging challenges and connect with talented marketing students
            </p>
          </div>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Partnership Application</CardTitle>
              <CardDescription>
                Tell us about your brand and how you'd like to collaborate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Name of Brand</Label>
                  <Input
                    id="brandName"
                    value={formData.brandName}
                    onChange={(e) => setFormData(prev => ({ ...prev, brandName: e.target.value }))}
                    placeholder="Enter your brand name"
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
                  <Label htmlFor="partnershipType">What type of partnership?</Label>
                  <Select value={formData.partnershipType} onValueChange={handlePartnershipTypeChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select partnership type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="game-challenge">Game / Brand Challenge</SelectItem>
                      <SelectItem value="outreach">Outreach</SelectItem>
                      <SelectItem value="recruiting">Recruiting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.partnershipType === 'other' && (
                  <div className="space-y-2">
                    <Label htmlFor="otherDescription">Please specify</Label>
                    <Input
                      id="otherDescription"
                      value={formData.otherDescription}
                      onChange={(e) => setFormData(prev => ({ ...prev, otherDescription: e.target.value }))}
                      placeholder="Describe your partnership idea"
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="requestDescription">Description of Request</Label>
                  <Textarea
                    id="requestDescription"
                    value={formData.requestDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, requestDescription: e.target.value }))}
                    placeholder="Tell us more about your partnership goals and what you'd like to achieve..."
                    className="min-h-[120px]"
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Submit Partnership Request
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PartnerWithUs;