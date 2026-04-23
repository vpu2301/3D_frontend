
import { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Microscope } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { pingStatus, setAuth, PincerError } from '@/lib/pincerClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [apiUrl, setApiUrl] = useState(
    (import.meta.env.VITE_PINCER_API_URL as string | undefined) ?? 'http://localhost:8080'
  );
  const [token, setToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  const existingAuth =
    localStorage.getItem('isAuthenticated') === 'true' ||
    sessionStorage.getItem('isAuthenticated') === 'true';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const validEmail = import.meta.env.VITE_AUTH_EMAIL;
      const validPassword = import.meta.env.VITE_AUTH_PASSWORD;

      if (email === validEmail && password === validPassword) {
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('isAuthenticated', 'true');
        storage.setItem('userEmail', email);

        toast({
          title: "Welcome back!",
          description: "Successfully logged in to 3Days.ai.",
        });

        navigate('/dashboard');
      } else {
        toast({
          title: "Invalid credentials",
          description: "The email or password you entered is incorrect.",
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

  const handleTokenConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUrl.trim() || !token.trim()) {
      toast({
        title: 'Missing fields',
        description: 'Enter both the API URL and the bearer token.',
        variant: 'destructive',
      });
      return;
    }
    setIsConnecting(true);
    try {
      const { version } = await pingStatus(apiUrl.trim(), token.trim());
      setAuth({ apiUrl: apiUrl.trim(), token: token.trim() });

      // Let the rest of the app treat this session as authenticated, so
      // ProtectedRoute lets us into /chat.
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', 'pincer-token-user');

      toast({
        title: 'Connected',
        description: `Pincer server ${version} is reachable.`,
      });
      navigate('/chat');
    } catch (err) {
      const msg =
        err instanceof PincerError
          ? err.status === 401
            ? 'Token rejected by the server.'
            : err.message
          : 'Could not reach the server. Check the URL.';
      toast({
        title: 'Connection failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsConnecting(false);
    }
  };

  if (existingAuth) return <Navigate to="/dashboard" replace />;

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
              Choose how you want to connect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="credentials" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="token">Token</TabsTrigger>
              </TabsList>

              {/* ── Credentials tab (existing flow) ── */}
              <TabsContent value="credentials">
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                        className="rounded"
                      />
                      <Label htmlFor="rememberMe" className="text-sm text-black/60 font-normal cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <Link to="/forgot-password" className="text-sm text-[#111111] hover:text-black/70 font-medium underline underline-offset-2">
                      Forgot password?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-10 bg-[#111111] hover:bg-[#222222] text-white font-medium rounded-xl border-0"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm text-black/50">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[#111111] hover:text-black/70 font-medium underline underline-offset-2">
                      Sign up
                    </Link>
                  </p>
                </div>
              </TabsContent>

              {/* ── Token tab (new: connects directly to a Pincer backend) ── */}
              <TabsContent value="token">
                <form onSubmit={handleTokenConnect} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="apiUrl" className="text-[#111111] text-sm font-medium">
                      Pincer API URL
                    </Label>
                    <Input
                      id="apiUrl"
                      type="url"
                      placeholder="https://pincer.example.com"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      required
                      className="h-10 bg-[#f9f6f2] border-black/10 text-[#111111] placeholder:text-black/35 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="token" className="text-[#111111] text-sm font-medium">
                      Bearer token
                    </Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="PINCER_DASHBOARD_TOKEN or PINCER_WEB_CHAT_TOKEN"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                      className="h-10 bg-[#f9f6f2] border-black/10 text-[#111111] placeholder:text-black/35 rounded-xl font-mono text-xs"
                    />
                  </div>
                  <p className="text-xs text-black/50 leading-relaxed">
                    Connect this browser to a Pincer backend using the shared bearer
                    token. No user account is created — the server keys your chat
                    history by a UUID stored in this browser.
                  </p>
                  <Button
                    type="submit"
                    className="w-full h-10 bg-[#111111] hover:bg-[#222222] text-white font-medium rounded-xl border-0"
                    disabled={isConnecting}
                  >
                    {isConnecting ? 'Connecting...' : 'Connect'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
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
