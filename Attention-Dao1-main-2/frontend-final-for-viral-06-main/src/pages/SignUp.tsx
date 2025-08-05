import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Gift, UserPlus, Mail, Lock, User, Building2 } from "lucide-react";

const SignUp = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              Join Viral Today
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Create your account and start building your marketing portfolio
            </p>
            <div className="flex items-center justify-center space-x-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <Gift className="w-6 h-6 text-green-500" />
              <span className="text-lg font-semibold text-green-600">
                Get a free token when you sign up!
              </span>
            </div>
          </div>

          {/* Sign Up Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <UserPlus className="w-6 h-6 text-viral-purple" />
                <span>Create Your Account</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName"
                    placeholder="Enter your first name"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName"
                    placeholder="Enter your last name"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Account Details */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="username"
                    placeholder="Choose a unique username"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Professional Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Your Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="marketer">Marketing Professional</SelectItem>
                      <SelectItem value="designer">Designer</SelectItem>
                      <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                      <SelectItem value="freelancer">Freelancer</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                      <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                      <SelectItem value="advanced">Advanced (5+ years)</SelectItem>
                      <SelectItem value="expert">Expert (10+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company/Organization (Optional)</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input 
                    id="company"
                    placeholder="Enter your company or school name"
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-2">
                <Label>Areas of Interest</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    "Social Media Marketing",
                    "Email Marketing",
                    "Content Creation",
                    "SEO/SEM",
                    "Graphic Design",
                    "Video Marketing",
                    "Analytics",
                    "Brand Strategy",
                    "E-commerce"
                  ].map((interest) => (
                    <label key={interest} className="flex items-center space-x-2 text-sm">
                      <Checkbox />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Terms and Privacy */}
              <div className="space-y-4">
                <label className="flex items-start space-x-2">
                  <Checkbox className="mt-1" />
                  <span className="text-sm text-muted-foreground">
                    I agree to the <a href="#" className="text-viral-purple hover:underline">Terms of Service</a> and <a href="#" className="text-viral-purple hover:underline">Privacy Policy</a>
                  </span>
                </label>
                
                <label className="flex items-start space-x-2">
                  <Checkbox className="mt-1" />
                  <span className="text-sm text-muted-foreground">
                    I want to receive updates about new features, games, and community events
                  </span>
                </label>
              </div>

              {/* Sign Up Button */}
              <Button variant="viral" className="w-full text-lg py-3">
                <Gift className="w-5 h-5 mr-2" />
                Create Account & Get Free Token
              </Button>

              {/* Already Have Account */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <a href="/sign-in" className="text-viral-purple hover:underline font-medium">
                    Sign in here
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle>What You'll Get</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">🎯 Portfolio Building</h4>
                  <p className="text-muted-foreground">Create and showcase your marketing work to potential employers and clients.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🎮 Prize Pool Games</h4>
                  <p className="text-muted-foreground">Participate in exciting competitions and win tokens for your achievements.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🌐 Professional Network</h4>
                  <p className="text-muted-foreground">Connect with marketing professionals, creators, and industry experts.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🛍️ ViralShop Access</h4>
                  <p className="text-muted-foreground">Use your earned tokens to purchase exclusive merchandise and designs.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignUp;