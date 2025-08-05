import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Image, Video, Link, FileText } from "lucide-react";

const CreatePost = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              Create a New Post
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your work, showcase your skills, and build your portfolio
            </p>
          </div>

          {/* Post Creation Form */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-2xl">Post Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Post Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Post Title</Label>
                <Input 
                  id="title"
                  placeholder="Enter an engaging title for your post"
                  className="w-full"
                />
              </div>

              {/* Post Type */}
              <div className="space-y-2">
                <Label htmlFor="type">Post Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select post type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="social-media">Social Media Campaign</SelectItem>
                    <SelectItem value="email-marketing">Email Marketing</SelectItem>
                    <SelectItem value="content-strategy">Content Strategy</SelectItem>
                    <SelectItem value="web-design">Web Design</SelectItem>
                    <SelectItem value="graphic-design">Graphic Design</SelectItem>
                    <SelectItem value="video-content">Video Content</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  placeholder="Describe your work, the challenge you solved, and the results achieved..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Media Upload */}
              <div className="space-y-2">
                <Label>Media Upload</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-2 border-dashed border-border hover:border-viral-purple/50 transition-colors">
                    <CardContent className="p-6 text-center">
                      <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag & drop files here</p>
                      <Button variant="outline" size="sm">
                        Choose Files
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Supported formats:</p>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center space-x-1 text-xs bg-accent px-2 py-1 rounded">
                        <Image className="w-3 h-3" />
                        <span>Images</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs bg-accent px-2 py-1 rounded">
                        <Video className="w-3 h-3" />
                        <span>Videos</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs bg-accent px-2 py-1 rounded">
                        <FileText className="w-3 h-3" />
                        <span>Documents</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* External Links */}
              <div className="space-y-2">
                <Label htmlFor="links">External Links (Optional)</Label>
                <div className="space-y-2">
                  <Input 
                    placeholder="Project URL or live demo"
                    className="w-full"
                  />
                  <Input 
                    placeholder="Additional reference link"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input 
                  id="tags"
                  placeholder="marketing, social-media, campaign (comma separated)"
                  className="w-full"
                />
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="views">Expected Views</Label>
                  <Input 
                    id="views"
                    type="number"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engagement">Engagement Rate (%)</Label>
                  <Input 
                    id="engagement"
                    type="number"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conversions">Conversions</Label>
                  <Input 
                    id="conversions"
                    type="number"
                    placeholder="0"
                    className="w-full"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button variant="viral" className="flex-1">
                  <Upload className="w-4 h-4 mr-2" />
                  Publish Post
                </Button>
                <Button variant="outline" className="flex-1">
                  Save as Draft
                </Button>
                <Button variant="ghost">
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips Section */}
          <Card className="glass-card mt-8">
            <CardHeader>
              <CardTitle>Tips for a Great Post</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">📸 Visual Content</h4>
                  <p className="text-muted-foreground">Include high-quality images or videos to showcase your work visually.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">📊 Show Results</h4>
                  <p className="text-muted-foreground">Include metrics and data that demonstrate the impact of your work.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🎯 Clear Objectives</h4>
                  <p className="text-muted-foreground">Explain the goals and challenges you addressed with your project.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">🏷️ Use Tags</h4>
                  <p className="text-muted-foreground">Add relevant tags to help others discover your content.</p>
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

export default CreatePost;