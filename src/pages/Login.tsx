/**
 * Login — split layout: the story on the left, the form on a brand-blue art
 * panel on the right (the reference composition, in our own design language).
 *
 * Both ways in are preserved exactly as they were:
 *   Credentials — the VITE_AUTH_* pair, storing isAuthenticated in local or
 *                 session storage depending on "remember me"
 *   Token       — pings a Pincer backend and stores {apiUrl, token}, which is
 *                 what every platform page reads to talk to the real server
 */
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import '@/styles/marketing.css';
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

  // Redirect already-authenticated visitors away from /login. This runs only
  // on mount — doing it inline during render would re-fire after the
  // post-connect re-render and clobber a navigate() from a submit handler.
  useEffect(() => {
    const isAuth =
      localStorage.getItem('isAuthenticated') === 'true' ||
      sessionStorage.getItem('isAuthenticated') === 'true';
    if (isAuth) navigate('/dashboard', { replace: true });
  }, [navigate]);

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
    const cleanUrl = apiUrl.trim().replace(/\/+$/, '');
    const cleanToken = token.trim();
    if (!cleanUrl || !cleanToken) {
      toast({
        title: 'Missing fields',
        description: 'Enter both the API URL and the bearer token.',
        variant: 'destructive',
      });
      return;
    }
    setIsConnecting(true);
    try {
      const { version } = await pingStatus(cleanUrl, cleanToken);
      setAuth({ apiUrl: cleanUrl, token: cleanToken });
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', 'pincer-token-user');

      toast({
        title: 'Connected',
        description: `Pincer server ${version} is reachable.`,
      });

      // Hard navigation. Don't reset isConnecting — letting React re-render
      // Login after we've scheduled navigation can race the browser's
      // location change and leave us stuck on /login.
      window.location.href = '/chat';
      return;
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
      setIsConnecting(false);
    }
  };

  const field =
    'h-11 rounded-[10px] border-[color:var(--line)] bg-white text-[color:var(--ink)] placeholder:text-[color:var(--text-5)]';

  return (
    <div className="site3d min-h-screen lg:grid lg:grid-cols-[1fr_1fr]">
      {/* ── Left: the story ── */}
      <div className="flex flex-col justify-between px-8 py-10 lg:px-16 lg:py-14">
        <Link to="/" className="m-lockup">
          <span className="name">3DAYS</span>
          <span className="kind">PLATFORM</span>
        </Link>

        <div className="py-14 lg:py-0">
          <h1 className="max-w-[13ch] text-[clamp(2.4rem,4.6vw,4.1rem)] text-[color:var(--ink)]">
            An AI workforce that starts before you do
          </h1>
          <p className="mt-8 max-w-md text-[17px] leading-relaxed text-[color:var(--text-3)]">
            Sign in to review what your AI employees handled, approve what needs a human,
            and see the hours they gave back this week.
          </p>
        </div>

        <p className="text-sm text-[color:var(--text-4)]">
          Copyright © {new Date().getFullYear()} All Rights Reserved by 3Days.ai
        </p>
      </div>

      {/* ── Right: the form, floating on the brand panel ── */}
      <div className="p-4 lg:py-6 lg:pr-6">
        <div className="m-auth-art flex min-h-[560px] items-center justify-center p-6 lg:min-h-full">
          <div className="relative z-10 w-full max-w-[420px] rounded-[20px] bg-white p-7 shadow-[0_30px_60px_-32px_rgba(10,16,60,0.55)] sm:p-9">
            <h2 className="text-center text-[26px] text-[color:var(--ink)]">Sign in</h2>
            <p className="mt-2 text-center text-[15px] text-[color:var(--text-3)]">
              Enter your account details below
            </p>

            <Tabs defaultValue="credentials" className="mt-7 w-full">
              <TabsList className="m-switch mb-6 grid h-auto w-full grid-cols-2">
                <TabsTrigger value="credentials" className="m-switch-item py-2">
                  Credentials
                </TabsTrigger>
                <TabsTrigger value="token" className="m-switch-item py-2">
                  Token
                </TabsTrigger>
              </TabsList>

              {/* ── Credentials tab ── */}
              <TabsContent value="credentials">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-[13px] font-medium text-[color:var(--text-2)]">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="text"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className={field}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-[13px] font-medium text-[color:var(--text-2)]">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className={field}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="rememberMe"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked === true)}
                      />
                      <Label
                        htmlFor="rememberMe"
                        className="cursor-pointer text-[13px] font-normal text-[color:var(--text-3)]"
                      >
                        Remember me
                      </Label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 h-11 w-full rounded-full bg-[color:var(--ink)] text-[15px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                  >
                    {isLoading ? 'Signing in…' : 'Sign in'}
                  </button>
                </form>

                <p className="mt-5 text-center text-[13px] text-[color:var(--text-3)]">
                  Forgot your credentials?{' '}
                  <Link to="/forgot-password" className="font-semibold text-[color:var(--ink)] underline underline-offset-2">
                    Reset password
                  </Link>
                </p>

                <div className="my-5 flex items-center gap-4">
                  <span className="h-px flex-1 bg-[color:var(--line)]" />
                  <span className="text-[13px] text-[color:var(--text-4)]">or</span>
                  <span className="h-px flex-1 bg-[color:var(--line)]" />
                </div>

                <p className="text-center text-[13px] text-[color:var(--text-3)]">
                  Don't have an account?{' '}
                  <Link to="/signup" className="font-semibold text-[color:var(--ink)] underline underline-offset-2">
                    Sign up
                  </Link>
                </p>
              </TabsContent>

              {/* ── Token tab (connects directly to a Pincer backend) ── */}
              <TabsContent value="token">
                <form onSubmit={handleTokenConnect} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="apiUrl" className="text-[13px] font-medium text-[color:var(--text-2)]">
                      Pincer API URL
                    </Label>
                    <Input
                      id="apiUrl"
                      type="url"
                      placeholder="https://pincer.example.com"
                      value={apiUrl}
                      onChange={(e) => setApiUrl(e.target.value)}
                      required
                      className={`${field} font-mono text-xs`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="token" className="text-[13px] font-medium text-[color:var(--text-2)]">
                      Bearer token
                    </Label>
                    <Input
                      id="token"
                      type="password"
                      placeholder="PINCER_DASHBOARD_TOKEN"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      required
                      className={`${field} font-mono text-xs`}
                    />
                  </div>
                  <p className="rounded-[10px] bg-[color:var(--blue-100)] p-3.5 text-xs leading-relaxed text-[color:var(--blue-deep)]">
                    Connects this browser to a Pincer backend with the shared bearer token. No user
                    account is created — the server keys your chat history by a UUID stored here.
                  </p>
                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="h-11 w-full rounded-full bg-[color:var(--ink)] text-[15px] font-semibold text-white transition-opacity hover:opacity-85 disabled:opacity-40"
                  >
                    {isConnecting ? 'Connecting…' : 'Connect'}
                  </button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
