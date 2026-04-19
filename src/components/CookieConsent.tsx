import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Cookie, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const STORAGE_KEY = 'cookie-consent-v1';
const OPEN_EVENT = 'open-cookie-settings';

type Categories = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
};

const defaultPrefs: Categories = {
  necessary: true,
  functional: false,
  analytics: false,
  marketing: false,
};

const allOn: Categories = {
  necessary: true,
  functional: true,
  analytics: true,
  marketing: true,
};

const loadPrefs = (): Categories | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...defaultPrefs, ...parsed, necessary: true };
  } catch {
    return null;
  }
};

const savePrefs = (prefs: Categories) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event(OPEN_EVENT));
};

const CookieConsent = () => {
  const { t } = useTranslation();
  const [bannerOpen, setBannerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [prefs, setPrefs] = useState<Categories>(defaultPrefs);

  useEffect(() => {
    const existing = loadPrefs();
    if (existing) {
      setPrefs(existing);
    } else {
      setBannerOpen(true);
    }
    const handler = () => {
      const current = loadPrefs();
      if (current) setPrefs(current);
      setSettingsOpen(true);
    };
    window.addEventListener(OPEN_EVENT, handler);
    return () => window.removeEventListener(OPEN_EVENT, handler);
  }, []);

  const acceptAll = () => {
    setPrefs(allOn);
    savePrefs(allOn);
    setBannerOpen(false);
    setSettingsOpen(false);
  };

  const rejectAll = () => {
    setPrefs(defaultPrefs);
    savePrefs(defaultPrefs);
    setBannerOpen(false);
    setSettingsOpen(false);
  };

  const saveSelection = () => {
    savePrefs(prefs);
    setBannerOpen(false);
    setSettingsOpen(false);
  };

  const toggle = (key: keyof Categories) => {
    if (key === 'necessary') return;
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  const categories: { key: keyof Categories; required?: boolean }[] = [
    { key: 'necessary', required: true },
    { key: 'functional' },
    { key: 'analytics' },
    { key: 'marketing' },
  ];

  return (
    <>
      {bannerOpen && !settingsOpen && (
        <div
          className="fixed bottom-4 left-4 right-4 md:left-6 md:right-6 z-[60] mx-auto max-w-5xl bg-[#1a1916] dark:bg-[#1a1916] text-white border border-white/10 shadow-2xl"
          style={{ borderRadius: '4px' }}
          role="dialog"
          aria-live="polite"
          aria-label={t('cookies.bannerTitle')}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-5 p-5 md:p-6">
            <div className="flex items-start gap-3 flex-1">
              <div
                className="w-9 h-9 bg-white/10 flex items-center justify-center flex-shrink-0"
                style={{ borderRadius: '4px' }}
              >
                <Cookie className="w-4 h-4 text-white/80" />
              </div>
              <div>
                <p className="text-white/90 font-semibold text-sm mb-1">
                  {t('cookies.bannerTitle')}
                </p>
                <p className="text-white/50 text-sm leading-relaxed">
                  {t('cookies.bannerBody')}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
              <button
                onClick={() => setSettingsOpen(true)}
                className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium border border-white/15 hover:bg-white/5 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                {t('cookies.customize')}
              </button>
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-white/80 hover:text-white text-sm font-medium border border-white/15 hover:bg-white/5 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                {t('cookies.rejectAll')}
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 bg-white hover:bg-[#f5f3ee] text-[#141413] text-sm font-medium transition-colors"
                style={{ borderRadius: '4px' }}
              >
                {t('cookies.acceptAll')}
              </button>
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center p-0 md:p-6">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSettingsOpen(false)}
            aria-hidden
          />
          <div
            className="relative w-full max-w-xl bg-white dark:bg-[#1a1916] text-[#1a1916] dark:text-white shadow-2xl border border-black/5 dark:border-white/10"
            style={{ borderRadius: '4px' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-settings-title"
          >
            <div className="flex items-start justify-between p-6 border-b border-black/5 dark:border-white/10">
              <div>
                <h2 id="cookie-settings-title" className="text-lg font-semibold tracking-tight">
                  {t('cookies.settingsTitle')}
                </h2>
                <p className="text-sm text-black/55 dark:text-white/55 mt-1">
                  {t('cookies.settingsBody')}
                </p>
              </div>
              <button
                onClick={() => setSettingsOpen(false)}
                aria-label={t('common.cancel')}
                className="text-black/40 hover:text-black/80 dark:text-white/40 dark:hover:text-white/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="max-h-[55vh] overflow-y-auto px-6 py-2 divide-y divide-black/5 dark:divide-white/10">
              {categories.map(({ key, required }) => (
                <div key={key} className="flex items-start justify-between gap-4 py-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold">
                        {t(`cookies.categories.${key}.name`)}
                      </h3>
                      {required && (
                        <span
                          className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 bg-black/5 dark:bg-white/10 text-black/55 dark:text-white/55"
                          style={{ borderRadius: '3px' }}
                        >
                          {t('cookies.alwaysActive')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-black/55 dark:text-white/55 mt-1 leading-relaxed">
                      {t(`cookies.categories.${key}.description`)}
                    </p>
                  </div>
                  <Switch
                    checked={prefs[key]}
                    disabled={required}
                    onCheckedChange={() => toggle(key)}
                    aria-label={t(`cookies.categories.${key}.name`)}
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-2 p-6 border-t border-black/5 dark:border-white/10">
              <button
                onClick={rejectAll}
                className="px-4 py-2 text-sm font-medium border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                {t('cookies.rejectAll')}
              </button>
              <button
                onClick={saveSelection}
                className="px-4 py-2 text-sm font-medium border border-black/10 dark:border-white/15 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                style={{ borderRadius: '4px' }}
              >
                {t('cookies.savePreferences')}
              </button>
              <button
                onClick={acceptAll}
                className="px-4 py-2 bg-[#1a1916] dark:bg-white text-white dark:text-[#1a1916] hover:opacity-90 text-sm font-medium transition-opacity"
                style={{ borderRadius: '4px' }}
              >
                {t('cookies.acceptAll')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
