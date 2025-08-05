import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send, Building2, User, Plus } from "lucide-react";

const Messages = () => {
  // Sample message conversations
  const conversations = [
    {
      id: 1,
      type: "user",
      name: "Sarah Chen",
      handle: "@sarahc_designs",
      avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Thanks for the feedback on my portfolio! Would love to collaborate.",
      timestamp: "2 hours ago",
      unread: true
    },
    {
      id: 2,
      type: "brand",
      name: "Nike Marketing",
      handle: "@nike_official",
      avatar: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&h=150&fit=crop",
      lastMessage: "We'd love to discuss an internship opportunity with you.",
      timestamp: "1 day ago",
      unread: false
    },
    {
      id: 3,
      type: "user",
      name: "Alex Kim",
      handle: "@alexkim_dev",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      lastMessage: "Great game creation! Let's team up for the next challenge.",
      timestamp: "3 days ago",
      unread: false
    },
    {
      id: 4,
      type: "brand",
      name: "Spotify",
      handle: "@spotify",
      avatar: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=150&h=150&fit=crop",
      lastMessage: "Your music marketing case study was impressive!",
      timestamp: "1 week ago",
      unread: false
    }
  ];

  // Sample messages from active conversation
  const activeMessages = [
    {
      id: 1,
      sender: "other",
      message: "Hey! I saw your latest portfolio post about the Instagram campaign. Really impressive results!",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      sender: "me",
      message: "Thank you! It was a challenging project but the client was thrilled with the engagement boost.",
      timestamp: "10:32 AM"
    },
    {
      id: 3,
      sender: "other",
      message: "I'm working on a similar project for a local restaurant. Would you be interested in collaborating?",
      timestamp: "10:35 AM"
    },
    {
      id: 4,
      sender: "me",
      message: "Absolutely! I'd love to help. What kind of timeline are you working with?",
      timestamp: "10:37 AM"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              Messages
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with other users and brands in the Viral community
            </p>
          </div>

          {/* Messages Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Conversations List */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-viral-purple" />
                    Conversations
                  </CardTitle>
                  <Button variant="outline" size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    New
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className="flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer border-b border-border/10"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={conversation.avatar} alt={conversation.name} />
                        <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm truncate">{conversation.name}</span>
                          {conversation.type === "brand" ? (
                            <Building2 className="w-3 h-3 text-viral-purple" />
                          ) : (
                            <User className="w-3 h-3 text-viral-cyan" />
                          )}
                          {conversation.unread && (
                            <div className="w-2 h-2 bg-viral-purple rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {conversation.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Active Conversation */}
            <Card className="glass-card lg:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=150&h=150&fit=crop&crop=face" alt="Sarah Chen" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">Sarah Chen</CardTitle>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-muted-foreground">@sarahc_designs</p>
                      <Badge variant="secondary" className="text-xs">
                        <User className="w-3 h-3 mr-1" />
                        User
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col h-[400px]">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {activeMessages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        message.sender === 'me' 
                          ? 'bg-viral-purple text-white' 
                          : 'bg-muted'
                      }`}>
                        <p className="text-sm">{message.message}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'me' 
                            ? 'text-white/70' 
                            : 'text-muted-foreground'
                        }`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input 
                    placeholder="Type your message..." 
                    className="flex-1"
                  />
                  <Button variant="viral">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Types Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-viral-cyan" />
                  Message Other Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Connect with fellow marketing students, collaborate on projects, and share insights.
                </p>
                <ul className="text-sm space-y-2">
                  <li>• Collaborate on portfolio projects</li>
                  <li>• Share marketing tips and strategies</li>
                  <li>• Form study groups and teams</li>
                  <li>• Congratulate on achievements</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-viral-purple" />
                  Message Brands
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Reach out to verified brands for internships, partnerships, and opportunities.
                </p>
                <ul className="text-sm space-y-2">
                  <li>• Apply for internship positions</li>
                  <li>• Pitch collaboration ideas</li>
                  <li>• Request portfolio feedback</li>
                  <li>• Explore career opportunities</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Messages;