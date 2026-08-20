import { cn } from '@/lib/utils';

interface Props {
  name: string;
  email?: string;
  size?: number;
  className?: string;
}

/**
 * Quiet, low-saturation identity tints. Enough separation to tell senders
 * apart at a glance without the rainbow gradients the platform system bans.
 */
const PALETTE: { bg: string; fg: string }[] = [
  { bg: '#e6e9f6', fg: '#3b4472' },
  { bg: '#e4efe8', fg: '#2f5a41' },
  { bg: '#f2ebe1', fg: '#6b5330' },
  { bg: '#f3e7ea', fg: '#6d3b45' },
  { bg: '#e5edf2', fg: '#33505f' },
  { bg: '#ece9f2', fg: '#4d3f6b' },
];

function colorFor(seed: string): { bg: string; fg: string } {
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
  const { bg, fg } = colorFor(seed);
  return (
    <div
      role="img"
      aria-label={name}
      className={cn('flex shrink-0 items-center justify-center rounded-full font-semibold', className)}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, size * 0.38),
        backgroundColor: bg,
        color: fg,
      }}
    >
      {initials(name)}
    </div>
  );
}
