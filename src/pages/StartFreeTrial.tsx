
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowRight, Check, Star } from 'lucide-react';

const StartFreeTrial = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    companySize: '',
    role: '',
    agreeToTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trial signup:', formData);
  };

  const benefits = [
    '14-day free trial',
    'No credit card required',
    'Full access to all features',
    'Dedicated onboarding support',
    'Cancel anytime'
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Start Your Free Trial
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Experience the power of AI automation with no commitment. Get started in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companySize">Company Size</Label>
                    <Select onValueChange={(value) => setFormData({...formData, companySize: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10 employees</SelectItem>
                        <SelectItem value="11-50">11-50 employees</SelectItem>
                        <SelectItem value="51-200">51-200 employees</SelectItem>
                        <SelectItem value="201-1000">201-1000 employees</SelectItem>
                        <SelectItem value="1000+">1000+ employees</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <Select onValueChange={(value) => setFormData({...formData, role: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ceo">CEO/Founder</SelectItem>
                        <SelectItem value="cto">CTO</SelectItem>
                        <SelectItem value="operations">Operations Manager</SelectItem>
                        <SelectItem value="it">IT Manager</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({...formData, agreeToTerms: checked as boolean})}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the Terms of Service and Privacy Policy
                    </Label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-black hover:bg-gray-800 text-white h-12 rounded-full transition-all duration-300 hover:scale-105"
                    disabled={!formData.agreeToTerms}
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-6">What's included?</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Check className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 font-medium">4.9/5</span>
                </div>
                <p className="text-gray-700 italic mb-4">
                  "3days.ai transformed our workflow completely. We saved 25 hours per week in the first month!"
                </p>
                <div className="text-sm text-gray-600">
                  - Sarah Chen, Operations Director at TechFlow
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-sm text-gray-500">
                Questions? <a href="/contact" className="text-blue-600 hover:text-blue-800">Contact our team</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartFreeTrial;
