import { Link } from 'react-router-dom';
import { ChevronRight, HardDrive } from 'lucide-react';
import { useDriveStore, ancestorChain, selectItemsMap } from '@/pages/drive/_hooks/use-drive-store';

interface Props {
  folderId: string | null;
}

export default function Breadcrumb({ folderId }: Props) {
  const itemsMap = useDriveStore(selectItemsMap);
  const chain = ancestorChain(itemsMap, folderId);
  return (
    <nav className="flex items-center gap-1 text-[13px] text-[var(--text-3)]">
      <Link to="/drive" className="flex items-center gap-1 rounded-[8px] px-1.5 py-0.5 transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]">
        <HardDrive className="h-3.5 w-3.5" />
        My Drive
      </Link>
      {chain
        .filter((c) => c.id !== 'drive_root')
        .map((c) => (
          <span key={c.id} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-[var(--text-5)]" />
            <Link
              to={`/drive/folder/${c.id}`}
              className="rounded-[8px] px-1.5 py-0.5 transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              {c.emoji ? `${c.emoji} ` : ''}
              {c.name}
            </Link>
          </span>
        ))}
    </nav>
  );
}
