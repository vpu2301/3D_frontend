import { cn } from '@/lib/utils';

interface Props {
  name: string;
  email?: string;
  size?: number;
  className?: string;
}

const PALETTE = [
  'from-violet-400 to-blue-500',
  'from-emerald-400 to-cyan-500',
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-sky-400 to-indigo-500',
  'from-lime-400 to-emerald-500',
];

function colorFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({ name, email, size = 32, className }: Props) {
  const seed = email || name;
  return (
    <div
      role="img"
      aria-label={name}
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-medium text-white',
        colorFor(seed),
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(10, size * 0.4) }}
    >
      {initials(name)}
    </div>
  );
}
