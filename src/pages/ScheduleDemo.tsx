
import { useState } from 'react';
import { CalendarDays, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const ScheduleDemo = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: '',
    employees: '',
    useCase: '',
    timeSlot: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Demo scheduled:', formData);
  };

  const benefits = [
    'Personalized demonstration of 3days.ai platform',
    'Custom ROI analysis for your organization',
    'Live workflow automation examples',
    'Q&A with automation experts',
    'Implementation roadmap discussion',
    'Free 30-day trial setup'
  ];

  const demoTypes = [
    {
      title: 'Executive Overview',
      duration: '30 minutes',
      audience: 'C-Suite, VPs',
      description: 'High-level business value and strategic overview',
      icon: Users
    },
    {
      title: 'Technical Deep Dive',
      duration: '45 minutes',
      audience: 'IT Leaders, Architects',
      description: 'Platform architecture, security, and integrations',
      icon: Clock
    },
    {
      title: 'Use Case Workshop',
      duration: '60 minutes',
      audience: 'Department Heads',
      description: 'Specific workflow automation for your industry',
      icon: CalendarDays
    }
  ];

  const timeSlots = [
    '9:00 AM - 9:30 AM EST',
    '10:00 AM - 10:30 AM EST',
    '11:00 AM - 11:30 AM EST',
    '1:00 PM - 1:30 PM EST',
    '2:00 PM - 2:30 PM EST',
    '3:00 PM - 3:30 PM EST',
    '4:00 PM - 4:30 PM EST'
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              See 3days.ai in
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Action
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              Book a personalized demo and discover how our AI-powered digital workers 
              can transform your business operations in just 30 minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Types */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Choose Your Demo Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Select the demo format that best fits your role and objectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {demoTypes.map((demo, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-6">
                    <demo.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">{demo.title}</h3>
                  <p className="text-blue-600 font-medium mb-2">{demo.duration}</p>
                  <p className="text-gray-600 text-sm mb-4">For: {demo.audience}</p>
                  <p className="text-gray-700">{demo.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-2xl font-light">Schedule Your Demo</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Business Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={formData.company}
                          onChange={(e) => setFormData({...formData, company: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Job Title</Label>
                        <Input
                          id="role"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employees">Company Size</Label>
                      <Select value={formData.employees} onValueChange={(value) => setFormData({...formData, employees: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-50">1-50 employees</SelectItem>
                          <SelectItem value="51-200">51-200 employees</SelectItem>
                          <SelectItem value="201-1000">201-1,000 employees</SelectItem>
                          <SelectItem value="1000+">1,000+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="useCase">Primary Use Case</Label>
                      <Select value={formData.useCase} onValueChange={(value) => setFormData({...formData, useCase: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="What would you like to automate?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="data-entry">Data Entry & Processing</SelectItem>
                          <SelectItem value="customer-service">Customer Service</SelectItem>
                          <SelectItem value="sales">Sales Operations</SelectItem>
                          <SelectItem value="hr">HR Processes</SelectItem>
                          <SelectItem value="finance">Financial Operations</SelectItem>
                          <SelectItem value="marketing">Marketing Automation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timeSlot">Preferred Time</Label>
                      <Select value={formData.timeSlot} onValueChange={(value) => setFormData({...formData, timeSlot: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select preferred time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Information (Optional)</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your specific automation needs..."
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        rows={3}
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-full transition-all duration-300 hover:scale-105"
                    >
                      Schedule Demo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Benefits */}
            <div>
              <div className="mb-8">
                <h3 className="text-3xl font-light text-gray-900 mb-6">What You'll Get</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-8">
                  <h4 className="text-xl font-medium text-gray-900 mb-4">Why Companies Choose 3days.ai</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average ROI</span>
                      <span className="font-medium">567%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Implementation Time</span>
                      <span className="font-medium">2-4 weeks</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time Saved per Employee</span>
                      <span className="font-medium">18+ hours/week</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer Satisfaction</span>
                      <span className="font-medium">4.8/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScheduleDemo;
