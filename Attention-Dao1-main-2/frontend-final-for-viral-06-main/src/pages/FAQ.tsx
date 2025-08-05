import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Viral
            </p>
          </div>

          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="marketing-students">
                  <AccordionTrigger>Is Viral only for marketing or college students?</AccordionTrigger>
                  <AccordionContent>
                    Viral is targeted toward marketing students but is open to anyone interested in building a portfolio or gaining experience. We welcome creative minds from all backgrounds who want to participate in challenges and showcase their skills.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="employers-hire">
                  <AccordionTrigger>How do employers hire through Viral?</AccordionTrigger>
                  <AccordionContent>
                    Employers are encouraged to use the "Hire from Viral" form. Then, they can reach out to students directly through messaging or external application links. This allows for direct communication and seamless recruitment processes.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prevent-cheating">
                  <AccordionTrigger>How do you prevent cheating in games and voting?</AccordionTrigger>
                  <AccordionContent>
                    We use Snapshot's quadratic voting to limit unfair advantages. Game cheating is reduced through controlled token entry limits and creator rules. This ensures a fair and competitive environment for all participants.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="portfolio-work">
                  <AccordionTrigger>Can I add work from challenges to MyPortfolio?</AccordionTrigger>
                  <AccordionContent>
                    Yes! Students are encouraged to add challenge work and outreach designs to showcase their skills. Your portfolio is the perfect place to highlight your best work from competitions and demonstrate your growth.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="getting-started">
                  <AccordionTrigger>How do I get started on Viral?</AccordionTrigger>
                  <AccordionContent>
                    Start by creating your account and setting up your profile. Then explore active prize pool games, participate in challenges, and begin building your portfolio. You can earn tokens through participation and use them to enter premium competitions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="token-system">
                  <AccordionTrigger>How does the token system work?</AccordionTrigger>
                  <AccordionContent>
                    Tokens are our platform currency that you can earn through participation, winning challenges, and community engagement. Use tokens to enter premium games, purchase items in the Viral Shop, or unlock special features. Check out our "How To Earn Tokens" and "How To Use Tokens" pages for detailed information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="support">
                  <AccordionTrigger>How can I get help or support?</AccordionTrigger>
                  <AccordionContent>
                    You can reach out through our messaging system, check our community forums, or contact us directly through the Partner with Us page. We're here to help you succeed and make the most of your Viral experience.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="prizes">
                  <AccordionTrigger>What kind of prizes can I win?</AccordionTrigger>
                  <AccordionContent>
                    Prizes vary by competition and can include cash rewards, brand partnerships, internship opportunities, professional mentorship, and exclusive merchandise. Each game clearly outlines its prize structure and requirements.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;