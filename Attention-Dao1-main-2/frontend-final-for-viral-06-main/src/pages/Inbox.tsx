import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inbox as InboxIcon, MessageCircle, Bell, Trophy, Users, UserMinus, Filter, Search } from "lucide-react";

const Inbox = () => {
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New message from DesignPro_2024",
      content: "Thanks for the feedback on my portfolio post!",
      timestamp: "2 hours ago",
      isRead: false,
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 2,
      type: "game",
      title: "Game result: Marketing Quiz Championship",
      content: "Congratulations! You placed 2nd and earned 150 tokens.",
      timestamp: "5 hours ago",
      isRead: true,
      icon: Trophy,
      color: "text-yellow-500"
    },
    {
      id: 3,
      type: "system",
      title: "System alert: You were unfollowed by MarketingExpert_2023",
      content: "A user has unfollowed your account.",
                  timestamp: "1 day ago",
                  isRead: false,
                  icon: UserMinus,
                  color: "text-red-500"
    },
    {
      id: 4,
      type: "post",
      title: "Your post received 50 new views",
      content: "Instagram Growth Campaign for Local Coffee Shop has reached 2,600+ views.",
      timestamp: "1 day ago",
      isRead: true,
      icon: Bell,
      color: "text-green-500"
    },
    {
      id: 5,
      type: "game",
      title: "New participants in your game",
      content: "5 new users joined 'Creative Design Speed Challenge'",
      timestamp: "2 days ago",
      isRead: false,
      icon: Users,
      color: "text-purple-500"
    },
    {
      id: 6,
      type: "message",
      title: "New message from GameMaster_X",
      content: "Looking forward to your next game creation.",
      timestamp: "3 days ago",
      isRead: true,
      icon: MessageCircle,
      color: "text-blue-500"
    },
    {
      id: 7,
      type: "system",
      title: "Weekly token summary",
      content: "You earned 425 tokens this week from posts and games.",
      timestamp: "1 week ago",
      isRead: true,
      icon: Bell,
      color: "text-viral-purple"
    },
    {
      id: 8,
      type: "post",
      title: "Post milestone reached",
      content: "Your Email Marketing Funnel post reached 2,000+ views!",
      timestamp: "1 week ago",
      isRead: true,
      icon: Trophy,
      color: "text-yellow-500"
    }
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "message": return "bg-blue-500/10 text-blue-600";
      case "game": return "bg-yellow-500/10 text-yellow-600";
      case "post": return "bg-green-500/10 text-green-600";
      case "system": return "bg-red-500/10 text-red-600";
      default: return "bg-gray-500/10 text-gray-600";
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold glow-text mb-4">
              Inbox
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Notifications, messages, post updates, game alerts, and unfollow alerts all in one place
            </p>
          </div>

          {/* Inbox Controls */}
          <Card className="glass-card mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <InboxIcon className="w-5 h-5 text-viral-purple" />
                    <span className="font-semibold">
                      {notifications.length} Total Notifications
                    </span>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount} Unread
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input 
                      placeholder="Search notifications..."
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  
                  <Select>
                    <SelectTrigger className="w-full sm:w-40">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                      <SelectItem value="games">Game Alerts</SelectItem>
                      <SelectItem value="posts">Post Updates</SelectItem>
                      <SelectItem value="system">System Alerts</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm">
                    Mark All Read
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`glass-card cursor-pointer transition-all hover:shadow-lg ${
                  !notification.isRead ? 'border-viral-purple/30 bg-viral-purple/5' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <notification.icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold mb-1 ${!notification.isRead ? 'text-viral-purple' : ''}`}>
                            {notification.title}
                          </h3>
                          <p className="text-muted-foreground text-sm mb-2">
                            {notification.content}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.timestamp}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-viral-purple rounded-full"></div>
                          )}
                          <Badge variant="outline" className="text-xs capitalize">
                            {notification.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Notification Settings */}
          <Card className="glass-card mt-12">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Email Notifications</h4>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>New messages</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Game results</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Post milestones</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Weekly summaries</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Push Notifications</h4>
                  <div className="space-y-2 text-sm">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Real-time messages</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Game start reminders</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span>Important system alerts</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span>Marketing updates</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t border-border">
                <Button variant="viral">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Inbox;