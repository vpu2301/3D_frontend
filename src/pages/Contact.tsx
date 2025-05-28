
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'hello@3days.ai',
      description: 'Send us an email for general inquiries'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+1 (555) 123-4567',
      description: 'Speak with our team during business hours'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'San Francisco, CA',
      description: '123 Innovation Drive, Suite 400'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: 'Mon-Fri 9AM-6PM PST',
      description: 'We respond within 24 hours'
    }
  ];

  const contactTypes = [
    {
      icon: MessageCircle,
      title: 'General Inquiry',
      description: 'Questions about our platform or services'
    },
    {
      icon: Users,
      title: 'Sales',
      description: 'Interested in enterprise solutions'
    },
    {
      icon: Calendar,
      title: 'Demo Request',
      description: 'Schedule a personalized demonstration'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                We're Here to Help
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Have questions about 3days.ai? Want to see a demo? Or ready to get started? 
              We'd love to hear from you and help you discover how AI can transform your workflow.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{info.details}</p>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <Input id="firstName" type="text" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <Input id="lastName" type="text" placeholder="Doe" />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <Input id="email" type="email" placeholder="john@company.com" />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company
                  </label>
                  <Input id="company" type="text" placeholder="Your Company Name" />
                </div>

                <div>
                  <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select inquiry type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General Inquiry</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="demo">Demo Request</SelectItem>
                      <SelectItem value="support">Technical Support</SelectItem>
                      <SelectItem value="partnership">Partnership</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    rows={6} 
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Send Message
                  <Send className="ml-2 h-5 w-5" />
                </Button>
              </form>
            </div>

            {/* Contact Types */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">How Can We Help?</h2>
              <div className="space-y-6">
                {contactTypes.map((type, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex items-start">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-lg mr-4 flex-shrink-0">
                          <type.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{type.title}</h3>
                          <p className="text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg text-white">
                <h3 className="text-xl font-bold mb-4">Ready for a Demo?</h3>
                <p className="mb-4">
                  See 3days.ai in action with a personalized demonstration tailored to your business needs.
                </p>
                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                  Schedule Demo
                  <Calendar className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How quickly can I get started with 3days.ai?",
                answer: "You can start using 3days.ai within 24 hours. Our onboarding process is streamlined, and our AI workers come pre-trained for common business tasks."
              },
              {
                question: "What kind of tasks can the digital workers handle?",
                answer: "Our digital workers can handle a wide range of tasks including document processing, email management, data entry, report generation, customer support, and much more."
              },
              {
                question: "Is my data secure with 3days.ai?",
                answer: "Absolutely. We maintain enterprise-grade security with SOC 2 Type II certification, end-to-end encryption, and compliance with GDPR and CCPA regulations."
              },
              {
                question: "Can 3days.ai integrate with my existing tools?",
                answer: "Yes, we support 500+ integrations with popular business tools and platforms. Our API-first approach ensures seamless connectivity with your current workflow."
              }
            ].map((faq, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
