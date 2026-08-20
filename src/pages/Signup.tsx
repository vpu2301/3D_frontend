import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import '@/styles/marketing.css';

/**
 * Sign-up is the login screen's twin: same standalone split-screen shell,
 * same hero panel, same field chrome, same auth mechanics (a successful
 * sign-up signs you in) — only the form differs.
 */
const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    password: '',
    confirmPassword: ''
  });

  // Mirror Login: already-authenticated visitors skip straight to the app.
  useEffect(() => {
    const isAuth =
      localStorage.getItem('isAuthenticated') === 'true' ||
      sessionStorage.getItem('isAuthenticated') === 'true';
    if (isAuth) navigate('/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please re-enter your password.',
        variant: 'destructive',
      });
      return;
    }

    // Same auth mechanics as signing in — a fresh account goes straight to work.
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userEmail', formData.email);

    toast({
      title: `Welcome, ${formData.firstName}!`,
      description: 'Your account is ready.',
    });

    navigate('/dashboard');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const inputCls =
    'h-11 rounded-[10px] border-[color:var(--line)] bg-white text-[color:var(--ink)] placeholder:text-[color:var(--text-5)]';
  const labelCls = 'text-[13px] font-medium text-[color:var(--text-2)]';

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
            Put your first AI employee to work today
          </h1>
          <p className="mt-8 max-w-md text-[17px] leading-relaxed text-[color:var(--text-3)]">
            Create your account and hand over the repetitive work — free to start, set up in
            minutes, no credit card required.
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
            <h2 className="text-center text-[26px] text-[color:var(--ink)]">Sign up</h2>
            <p className="mt-2 text-center text-[15px] text-[color:var(--text-3)]">
              Create your account below
            </p>

            <div className="mt-7">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className={labelCls}>First name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className={labelCls}>Last name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className={labelCls}>Work email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className={labelCls}>Company name</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className={labelCls}>Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className={labelCls}>Confirm password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className={inputCls}
                />
              </div>

              <button
                type="submit"
                className="mt-1 h-11 w-full rounded-full bg-[color:var(--ink)] text-[15px] font-semibold text-white transition-opacity hover:opacity-85"
              >
                Create account
              </button>
            </form>

            <div className="my-5 flex items-center gap-4">
              <span className="h-px flex-1 bg-[color:var(--line)]" />
              <span className="text-[13px] text-[color:var(--text-4)]">or</span>
              <span className="h-px flex-1 bg-[color:var(--line)]" />
            </div>

            <p className="text-center text-[13px] text-[color:var(--text-3)]">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-[color:var(--ink)] underline underline-offset-2">
                Sign in
              </Link>
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
