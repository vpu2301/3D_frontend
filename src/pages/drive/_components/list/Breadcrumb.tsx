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
    <nav className="flex items-center gap-1 text-sm text-gray-600">
      <Link to="/drive" className="flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-gray-100 hover:text-gray-900">
        <HardDrive className="h-3.5 w-3.5" />
        My Drive
      </Link>
      {chain
        .filter((c) => c.id !== 'drive_root')
        .map((c) => (
          <span key={c.id} className="flex items-center gap-1">
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link
              to={`/drive/folder/${c.id}`}
              className="rounded px-1.5 py-0.5 hover:bg-gray-100 hover:text-gray-900"
            >
              {c.emoji ? `${c.emoji} ` : ''}
              {c.name}
            </Link>
          </span>
        ))}
    </nav>
  );
}
