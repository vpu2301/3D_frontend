import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const options = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
] as const;

const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const current = options.find(o => o.value === theme) ?? options[2];
  const Icon = current.icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-full transition-colors text-black/55 hover:text-[#111111] hover:bg-black/4 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/8"
        aria-label="Toggle theme"
      >
        <Icon className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-36 rounded-xl border border-black/8 bg-white shadow-lg shadow-black/10 z-50 overflow-hidden dark:bg-[#1c1916] dark:border-white/10 dark:shadow-black/40">
          {options.map(({ value, label, icon: OptionIcon }) => (
            <button
              key={value}
              onClick={() => { setTheme(value); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-sm transition-colors
                ${theme === value
                  ? 'text-[#111111] bg-black/6 font-medium dark:text-white dark:bg-white/10'
                  : 'text-black/60 hover:text-[#111111] hover:bg-black/4 dark:text-white/50 dark:hover:text-white dark:hover:bg-white/6'
                }`}
            >
              <OptionIcon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
