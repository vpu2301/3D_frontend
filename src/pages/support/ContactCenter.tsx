
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageCircle, Phone, Mail, Clock, MapPin, Users, Headphones, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactCenter = () => {
  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7 Available',
      responseTime: 'Instant',
      action: 'Start Chat',
      color: 'from-[color:var(--blue)] to-[color:var(--blue)]'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: 'Mon-Fri 6AM-6PM PST',
      responseTime: 'Immediate',
      action: 'Call Now',
      color: 'from-[color:var(--blue)] to-[color:var(--blue)]'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send detailed questions via email',
      availability: '24/7 Available',
      responseTime: 'Within 2 hours',
      action: 'Send Email',
      color: 'from-[color:var(--blue)] to-[color:var(--text-2)]'
    }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Technology Drive, San Francisco, CA 94105',
      phone: '+1 (555) 123-4567',
      hours: 'Mon-Fri 9AM-6PM PST'
    },
    {
      city: 'New York',
      address: '456 Innovation Avenue, New York, NY 10001',
      phone: '+1 (555) 987-6543',
      hours: 'Mon-Fri 9AM-6PM EST'
    },
    {
      city: 'London',
      address: '789 Business Square, London, UK SW1A 1AA',
      phone: '+44 20 7123 4567',
      hours: 'Mon-Fri 9AM-5PM GMT'
    }
  ];

  const supportStats = [
    { value: '< 30s', label: 'Average chat response' },
    { value: '98%', label: 'Customer satisfaction' },
    { value: '24/7', label: 'Support availability' },
    { value: '15+', label: 'Languages supported' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight">
            Contact Center
          </h1>
          <p className="text-xl text-[color:var(--text-2)] mb-8 font-light">
            Get the help you need, when you need it. Our expert support team is here to assist you
          </p>
        </div>
      </section>

      {/* Support Stats */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {supportStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-[color:var(--blue)] mb-2">{stat.value}</div>
                <div className="text-[color:var(--text-2)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Get Support</h2>
            <p className="text-xl text-[color:var(--text-2)]">Choose the best way to reach us</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className={`p-4 rounded-[28px] bg-gradient-to-r ${method.color} w-fit mx-auto mb-6`}>
                    <method.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{method.title}</h3>
                  <p className="text-[color:var(--text-2)] mb-6 leading-relaxed">{method.description}</p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-center text-sm text-[color:var(--text-2)]">
                      <Clock className="h-4 w-4 mr-2" />
                      {method.availability}
                    </div>
                    <div className="text-sm text-[color:var(--blue)] font-medium">
                      Response: {method.responseTime}
                    </div>
                  </div>
                  <Button className="w-full">{method.action}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Send us a Message</h2>
            <p className="text-xl text-[color:var(--text-2)]">Fill out the form below and we'll get back to you soon</p>
          </div>

          <div className="bg-[color:var(--paper)] p-8 rounded-[28px] shadow-lg">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--ink)] mb-2">First Name</label>
                  <Input placeholder="Your first name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--ink)] mb-2">Last Name</label>
                  <Input placeholder="Your last name" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[color:var(--ink)] mb-2">Email</label>
                  <Input type="email" placeholder="your.email@company.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[color:var(--ink)] mb-2">Phone (Optional)</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--ink)] mb-2">Subject</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--ink)] mb-2">Message</label>
                <Textarea 
                  placeholder="Describe your question or issue in detail..."
                  className="min-h-32"
                />
              </div>

              <Button className="w-full bg-[color:var(--ink)] hover:bg-[color:var(--ink)] text-white py-3">
                Send Message
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Our Offices</h2>
            <p className="text-xl text-[color:var(--text-2)]">Visit us at one of our global locations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <div key={index} className="bg-[color:var(--sand)] p-8 rounded-[28px]">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-[color:var(--blue)] mr-3" />
                  <h3 className="text-xl font-medium text-[color:var(--ink)]">{office.city}</h3>
                </div>
                <div className="space-y-3">
                  <p className="text-[color:var(--text-2)]">{office.address}</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-[color:var(--text-4)] mr-2" />
                    <span className="text-[color:var(--ink)]">{office.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-[color:var(--text-4)] mr-2" />
                    <span className="text-[color:var(--ink)]">{office.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 24/7 Support CTA */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[color:var(--paper)] rounded-[28px] p-12 text-[color:var(--ink)] text-center border border-[color:var(--line)]">
            <Headphones className="h-16 w-16 mx-auto mb-6 text-[color:var(--ink)]" />
            <h3 className="text-3xl font-light mb-6">24/7 Premium Support</h3>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-2xl mx-auto">
              Get priority access to our expert support team with faster response times and dedicated assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3">
                Upgrade to Premium
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" className="border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink)] hover:bg-[color:var(--paper)] rounded-full py-3">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactCenter;
