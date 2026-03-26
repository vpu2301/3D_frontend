
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Microscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    console.log('Login: Form submitted with email:', email);

    try {
      // Check for admin credentials
      if (email.toLowerCase() === 'admin' && password === 'admin') {
        console.log('Login: Admin credentials detected, logging in...');
        
        // Set authentication state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', 'admin@3days.ai');
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in as Admin.",
        });

        console.log('Login: Redirecting to dashboard...');
        navigate('/dashboard');
        return;
      }

      // For demo purposes, accept any email/password combination
      if (email && password) {
        console.log('Login: Valid credentials provided, logging in...');
        
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userEmail', email);
        
        toast({
          title: "Welcome back!",
          description: "Successfully logged in to 3Days.ai.",
        });

        console.log('Login: Redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        toast({
          title: "Error",
          description: "Please enter both email and password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ede3] dark:bg-[#181512] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <div className="w-9 h-9 bg-[#111111] rounded-xl flex items-center justify-center mr-3">
              <Microscope className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-xl font-semibold text-[#111111] tracking-tight">3Days.ai</span>
          </Link>
          <h2 className="text-2xl font-bold text-[#111111] tracking-tight">Welcome back</h2>
          <p className="text-black/50 mt-2 text-sm">Sign in to your platform</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white border-black/8 shadow-lg shadow-black/6 rounded-3xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold text-[#111111]">Sign in</CardTitle>
            <CardDescription className="text-black/50">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#111111] text-sm font-medium">Email or Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-10 bg-[#f9f6f2] border-black/10 text-[#111111] placeholder:text-black/35 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#111111] text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-10 bg-[#f9f6f2] border-black/10 text-[#111111] placeholder:text-black/35 rounded-xl"
                />
              </div>
              <Button
                type="submit"
                className="w-full h-10 bg-[#111111] hover:bg-[#222222] text-white font-medium rounded-full border-0"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-black/50">
                Don't have an account?{' '}
                <Link to="/signup" className="text-[#111111] hover:text-black/70 font-medium underline underline-offset-2">
                  Start your free trial
                </Link>
              </p>
            </div>

            {/* Admin Demo Info */}
            <div className="mt-6 p-4 bg-[#f9f6f2] rounded-2xl border border-black/8">
              <p className="text-sm text-[#111111] font-medium mb-1">Demo Access</p>
              <p className="text-xs text-black/50">
                Use "admin" / "admin" for admin dashboard access
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-sm text-black/45 hover:text-black transition-colors">
            ← Back to 3Days.ai
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
