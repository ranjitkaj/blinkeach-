import React from 'react';
import { Helmet } from 'react-helmet';
import { ArrowLeft, Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ContactUsPage: React.FC = () => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message sent",
      description: "Thank you for contacting us. We'll get back to you shortly.",
    });
    // In a real application, this would send the form data to a server
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Helmet>
        <title>Contact Us - Blinkeach</title>
        <meta name="description" content="Get in touch with Blinkeach's customer support team. We're here to help you with any questions or concerns." />
      </Helmet>

      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6">
            Have a question, comment, or suggestion? We'd love to hear from you. Fill out the form, and our team will get back to you as soon as possible.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Email Us</h3>
                <p className="text-sm text-muted-foreground">support@blinkeach.com</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Call Us</h3>
                <p className="text-sm text-muted-foreground">+91 8709144545</p>
                <p className="text-sm text-muted-foreground">Monday to Saturday, 9:00 AM to 6:00 PM</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Visit Us</h3>
                <p className="text-sm text-muted-foreground">
                  Blinkeach Headquarters<br />
                  Ground Floor, House No. 18,<br />
                  KB Lane, Near Yusuf Masjid, Ward No.13, <br />
                  Panchaiti Akhara, <br />
                  Gaya 823001<br />
                  Bihar, India
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 mt-0.5 text-primary" />
              <div>
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Available Monday to Saturday<br />
                  9:00 AM to 8:00 PM
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Send us a message</CardTitle>
              <CardDescription>Fill in the form below, and we'll respond within 24 hours.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" placeholder="Your full name" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" type="email" placeholder="Your email address" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                  <Input id="phone" placeholder="Your phone number" />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" placeholder="What is this regarding?" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <Textarea id="message" placeholder="Please provide details about your inquiry..." rows={4} required />
                </div>
                
                <Button type="submit" className="w-full">Submit</Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center text-xs text-muted-foreground">
              By submitting this form, you agree to our Privacy Policy and Terms of Service.
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <div className="bg-muted p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-3">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">What are your business hours?</h3>
            <p className="text-sm text-muted-foreground">Our customer service team is available Monday to Saturday, from 9:00 AM to 6:00 PM. Our website is operational 24/7.</p>
          </div>
          
          <div>
            <h3 className="font-medium">How can I track my order?</h3>
            <p className="text-sm text-muted-foreground">You can track your order by logging into your account and navigating to the "My Orders" section. Alternatively, use the "Track Order" link in the footer.</p>
          </div>
          
          <div>
            <h3 className="font-medium">What is your return policy?</h3>
            <p className="text-sm text-muted-foreground">We offer a 7-day return policy for most items. Please visit our Return & Refund Policy page for detailed information.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUsPage;