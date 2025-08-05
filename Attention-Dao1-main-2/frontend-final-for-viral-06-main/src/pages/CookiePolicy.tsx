import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CookiePolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-8">
            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>What Are Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>
                  Cookies are small text files that are placed on your computer by websites that you visit. 
                  They are widely used in order to make websites work, or work more efficiently, as well as 
                  to provide information to the owners of the site.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>How We Use Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>
                  We use cookies to enhance your experience on our platform by remembering your preferences, 
                  keeping you logged in, and analyzing how you use our site to improve our services. This 
                  helps us provide a better user experience.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Types of Cookies We Use</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <ul>
                  <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                  <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                  <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site</li>
                  <li><strong>Marketing Cookies:</strong> Used to track visitors across websites for advertising</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Managing Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>
                  You can control and/or delete cookies as you wish. You can delete all cookies that are 
                  already on your computer and you can set most browsers to prevent them from being placed. 
                  However, if you do this, you may have to manually adjust some preferences every time you 
                  visit a site.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Third-Party Cookies</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>
                  Some cookies on our site are set by third-party services that appear on our pages. We do 
                  not control these cookies and recommend you check the third-party websites for more 
                  information about their cookies and how to manage them.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card border-white/20">
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-invert max-w-none">
                <p>
                  If you have any questions about our use of cookies, please contact us at cookies@viral.app 
                  or through our Partner with Us form.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;