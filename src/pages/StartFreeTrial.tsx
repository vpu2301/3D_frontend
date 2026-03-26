
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowRight, Zap, Shield, Users } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const StartFreeTrial = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: ''
  });

  useEffect(() => {
    console.log('StartFreeTrial: Component mounted and rendering');
    console.log('StartFreeTrial: Current location:', window.location.pathname);
  }, []);

  const benefits = [
    "14-day free trial",
    "No credit card required",
    "Full access to all features",
    "24/7 support included",
    "Easy setup in minutes"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Trial signup submitted:', formData);
    // In a real app, this would submit to an API
    navigate('/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start Your Free Trial
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the power of AI employees with no commitment. Get started in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Create Your Free Account</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Work Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Benefits */}
            <div className="space-y-8">
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <Zap className="h-6 w-6 text-blue-600 mr-2" />
                    What's Included
                  </h3>
                  <ul className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="text-center p-6">
                  <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Enterprise Security</h4>
                  <p className="text-sm text-gray-600">Bank-level encryption and compliance</p>
                </Card>
                
                <Card className="text-center p-6">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h4 className="font-semibold mb-2">Expert Support</h4>
                  <p className="text-sm text-gray-600">24/7 assistance from our team</p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default StartFreeTrial;
