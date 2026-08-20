import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Users, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

/** Field chrome shared with login/signup — one form language everywhere. */
const inputCls =
  'h-12 rounded-[14px] border-[color:var(--line)] bg-[color:var(--sand)] text-[color:var(--ink)] placeholder:text-[color:var(--text-5)] focus-visible:ring-[color:var(--blue)]';
const labelCls = 'text-[13px] font-semibold text-[color:var(--text-1)]';

const ScheduleDemo = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    phone: '',
    employees: '',
    timeSlot: '',
    goals: ''
  });

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const demoFeatures = [
    "Personalized platform walkthrough",
    "AI employee configuration demo",
    "Custom use case discussion",
    "ROI calculation for your business",
    "Implementation roadmap",
    "Q&A with our AI experts"
  ];

  const demoDetails = [
    { label: 'Duration', value: '30 minutes' },
    { label: 'Format', value: 'Video call (Zoom/Teams)' },
    { label: 'Preparation', value: 'None required' },
    { label: 'Follow-up', value: 'Custom proposal within 24h' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Demo Scheduled!",
      description: "We'll send you a calendar invite and preparation materials.",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[color:var(--bg)]">
      <main>
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <p className="m-eyebrow mb-4">Book a demo</p>
            <h1 className="mx-auto max-w-[20ch] text-[clamp(2.25rem,4.5vw,3.25rem)] text-[color:var(--ink)]">
              Schedule your personal demo
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-[color:var(--text-2)]">
              Book a 30-minute personalized demo with our AI experts. We'll show you exactly
              how 3days.ai can transform your business operations.
            </p>
          </div>

          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Demo information */}
            <div className="space-y-4">
              <div className="m-panel p-7 sm:p-8">
                <h2 className="flex items-center gap-2.5 text-xl text-[color:var(--ink)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--blue-100)]">
                    <Clock className="h-4 w-4 text-[color:var(--blue)]" />
                  </span>
                  What to expect
                </h2>
                <ul className="mt-6 space-y-3">
                  {demoFeatures.map((feature) => (
                    <li key={feature} className="m-tile flex items-center gap-3 px-4 py-3">
                      <CheckCircle className="h-4 w-4 flex-shrink-0 text-[color:var(--blue)]" />
                      <span className="text-[15px] text-[color:var(--ink)]">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="m-panel p-7 sm:p-8">
                <h2 className="flex items-center gap-2.5 text-xl text-[color:var(--ink)]">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--blue-100)]">
                    <Users className="h-4 w-4 text-[color:var(--blue)]" />
                  </span>
                  Demo details
                </h2>
                <div className="mt-6 divide-y divide-[color:var(--line)]">
                  {demoDetails.map((row) => (
                    <div key={row.label} className="flex items-baseline justify-between py-3">
                      <span className="text-sm text-[color:var(--text-2)]">{row.label}</span>
                      <span className="text-sm font-semibold text-[color:var(--ink)]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking form */}
            <div className="m-panel p-7 sm:p-8">
              <h2 className="text-xl text-[color:var(--ink)]">Book your demo</h2>
              <p className="mt-1.5 text-sm text-[color:var(--text-3)]">
                Pick a slot — you'll get the invite right away.
              </p>
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className={labelCls}>First name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className={labelCls}>Last name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className={labelCls}>Work email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className={inputCls}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company" className={labelCls}>Company *</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      required
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={labelCls}>Phone number</Label>
                    <Input
                      id="phone"
                      placeholder="+49 …"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className={inputCls}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employees" className={labelCls}>Company size</Label>
                  <Select onValueChange={(value) => handleInputChange('employees', value)}>
                    <SelectTrigger className={cn(inputCls, 'w-full')}>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[14px] border-[color:var(--line)]">
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-1000">201-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className={labelCls}>Preferred date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className={cn(
                            inputCls,
                            'flex w-full items-center justify-start border px-3 text-left text-sm font-normal',
                            !selectedDate && 'text-[color:var(--text-5)]',
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4 text-[color:var(--text-4)]" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto rounded-[18px] border-[color:var(--line)] p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeSlot" className={labelCls}>Preferred time *</Label>
                    <Select onValueChange={(value) => handleInputChange('timeSlot', value)}>
                      <SelectTrigger className={cn(inputCls, 'w-full')}>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="rounded-[14px] border-[color:var(--line)]">
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goals" className={labelCls}>
                    What are your main automation goals? (Optional)
                  </Label>
                  <Textarea
                    id="goals"
                    placeholder="Tell us about your current challenges and what you'd like to automate..."
                    value={formData.goals}
                    onChange={(e) => handleInputChange('goals', e.target.value)}
                    rows={3}
                    className="rounded-[14px] border-[color:var(--line)] bg-[color:var(--sand)] text-[color:var(--ink)] placeholder:text-[color:var(--text-5)] focus-visible:ring-[color:var(--blue)]"
                  />
                </div>

                <button type="submit" className="m-btn m-btn-submit w-full">
                  Schedule demo
                  <span className="m-arrow">→</span>
                </button>

                <p className="text-center text-xs leading-relaxed text-[color:var(--text-3)]">
                  By booking a demo, you agree to our Terms of Service and Privacy Policy.
                  We'll only use your information to prepare for your demo.
                </p>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScheduleDemo;
