import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English',    native: 'English',    flag: '🇬🇧' },
  { code: 'de', label: 'German',     native: 'Deutsch',    flag: '🇩🇪' },
  { code: 'fr', label: 'French',     native: 'Français',   flag: '🇫🇷' },
  { code: 'es', label: 'Spanish',    native: 'Español',    flag: '🇪🇸' },
  { code: 'it', label: 'Italian',    native: 'Italiano',   flag: '🇮🇹' },
  { code: 'nl', label: 'Dutch',      native: 'Nederlands', flag: '🇳🇱' },
  { code: 'pt', label: 'Portuguese', native: 'Português',  flag: '🇵🇹' },
  { code: 'pl', label: 'Polish',     native: 'Polski',     flag: '🇵🇱' },
  { code: 'sv', label: 'Swedish',    native: 'Svenska',    flag: '🇸🇪' },
  { code: 'da', label: 'Danish',     native: 'Dansk',      flag: '🇩🇰' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentCode = languages.find(l => i18n.language?.startsWith(l.code))?.code ?? 'en';
  const current = languages.find(l => l.code === currentCode) ?? languages[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-[#141413]/12 text-black/55 hover:text-[#111111] hover:bg-black/4 transition-colors dark:border-white/12 dark:text-white/55 dark:hover:text-white dark:hover:bg-white/8"
        title="Change language"
      >
        <span className="uppercase tracking-wide">{current.code}</span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute top-full right-0 mt-2 w-48 bg-white border border-[#141413]/10 shadow-xl shadow-black/10 z-[300] overflow-hidden dark:bg-[#1a1815] dark:border-white/8 dark:shadow-black/40"
          style={{ borderRadius: '12px' }}
        >
          <div className="p-1.5">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => select(lang.code)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left ${
                  lang.code === currentCode
                    ? 'bg-[#141413]/6 text-[#111111] dark:bg-white/8 dark:text-white'
                    : 'text-[#141413]/60 hover:bg-[#141413]/4 hover:text-[#111111] dark:text-white/50 dark:hover:bg-white/6 dark:hover:text-white'
                }`}
              >
                <span className="font-medium">{lang.native}</span>
                <span className="ml-auto text-[11px] text-black/25 dark:text-white/25 uppercase tracking-wide">{lang.code}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
