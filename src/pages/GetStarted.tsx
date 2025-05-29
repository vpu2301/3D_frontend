
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Building, Users, Briefcase } from 'lucide-react';

const GetStarted = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    industry: '',
    employees: '',
    role: '',
    password: '',
    confirmPassword: '',
    solutions: [] as string[]
  });

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Manufacturing',
    'Retail',
    'Education',
    'Government',
    'Transportation',
    'Energy',
    'Construction',
    'Food & Beverage',
    'Professional Services',
    'Other'
  ];

  const employeeRanges = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  const availableSolutions = [
    { id: 'automation', label: 'AI Automation', description: 'Automate repetitive tasks and workflows' },
    { id: 'analytics', label: 'Analytics & Reporting', description: 'Data insights and performance tracking' },
    { id: 'integration', label: 'System Integration', description: 'Connect your existing tools and platforms' },
    { id: 'workflow', label: 'Workflow Management', description: 'Design and optimize business processes' },
    { id: 'security', label: 'Security & Compliance', description: 'Enterprise-grade security solutions' },
    { id: 'support', label: 'Customer Support', description: 'AI-powered customer service automation' },
    { id: 'sales', label: 'Sales Automation', description: 'Streamline sales processes and lead management' },
    { id: 'marketing', label: 'Marketing Automation', description: 'Automated marketing campaigns and nurturing' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Get started form submission:', formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSolutionToggle = (solutionId: string) => {
    setFormData(prev => ({
      ...prev,
      solutions: prev.solutions.includes(solutionId)
        ? prev.solutions.filter(id => id !== solutionId)
        : [...prev.solutions, solutionId]
    }));
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white px-4">
      <div className="max-w-5xl mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-light text-gray-900 mb-6">Get Started with 3days.ai</h1>
          <p className="text-xl text-gray-600 font-light">
            Tell us about your business and we'll customize the perfect automation solution for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-light">Create Your Account</CardTitle>
                <p className="text-gray-600">Start your automation journey today</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                          <Input
                            id="firstName"
                            type="text"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          className="h-12 border-gray-200 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-700">Work Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className="text-gray-700">Your Role</Label>
                      <Select onValueChange={(value) => handleInputChange('role', value)}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ceo">CEO / Founder</SelectItem>
                          <SelectItem value="cto">CTO / Technical Leader</SelectItem>
                          <SelectItem value="manager">Manager / Director</SelectItem>
                          <SelectItem value="operations">Operations</SelectItem>
                          <SelectItem value="sales">Sales</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="hr">Human Resources</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="it">IT / Technical</SelectItem>
                          <SelectItem value="consultant">Consultant</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Company Information
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-gray-700">Company Name</Label>
                      <div className="relative">
                        <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="company"
                          type="text"
                          placeholder="Your Company"
                          value={formData.company}
                          onChange={(e) => handleInputChange('company', e.target.value)}
                          className="pl-10 h-12 border-gray-200 focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-gray-700">Industry</Label>
                      <Select onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                          <Briefcase className="h-5 w-5 text-gray-400 mr-2" />
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry.toLowerCase()}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employees" className="text-gray-700">Number of Employees</Label>
                      <Select onValueChange={(value) => handleInputChange('employees', value)}>
                        <SelectTrigger className="h-12 border-gray-200 focus:border-blue-500">
                          <Users className="h-5 w-5 text-gray-400 mr-2" />
                          <SelectValue placeholder="Select company size" />
                        </SelectTrigger>
                        <SelectContent>
                          {employeeRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range} employees
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Solutions Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Which solutions interest you? (Select all that apply)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableSolutions.map((solution) => (
                        <div key={solution.id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={solution.id}
                            checked={formData.solutions.includes(solution.id)}
                            onCheckedChange={() => handleSolutionToggle(solution.id)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <label htmlFor={solution.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                              {solution.label}
                            </label>
                            <p className="text-xs text-gray-600 mt-1">{solution.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Account Security
                    </h3>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-gray-700">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-gray-700">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className="h-12 border-gray-200 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <Checkbox id="terms" required />
                    <label htmlFor="terms" className="text-sm text-gray-600">
                      I agree to the{' '}
                      <Link to="/terms" className="text-blue-600 hover:text-blue-800">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-md transition-all duration-300"
                  >
                    Get Started with 3days.ai
                  </Button>
                </form>

                <div className="relative">
                  <Separator />
                  <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
                    or continue with
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-12">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" className="h-12">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                      Sign in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits Sidebar */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-light text-gray-900 mb-6">What you'll get</h3>
              <div className="space-y-4">
                {[
                  '✨ Personalized automation strategy',
                  '🚀 30-day free trial with full features',
                  '📊 Real-time productivity analytics',
                  '🔗 500+ pre-built integrations',
                  '🛡️ Enterprise-grade security',
                  '💬 Dedicated customer success manager',
                  '⚡ Custom solution recommendations',
                  '📈 ROI tracking and reporting'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start text-gray-700">
                    <span className="text-base leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 p-6">
              <div className="text-center">
                <h4 className="text-xl font-medium text-gray-900 mb-2">Trusted by 10,000+ professionals</h4>
                <p className="text-gray-600 mb-4">Join teams at leading companies worldwide</p>
                <div className="flex justify-center space-x-3 opacity-70">
                  <div className="w-14 h-7 bg-stone-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-700">TECH</span>
                  </div>
                  <div className="w-14 h-7 bg-stone-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-700">INNOV</span>
                  </div>
                  <div className="w-14 h-7 bg-stone-300 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-700">FUTURE</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
