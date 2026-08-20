import { useNavigate, useLocation } from 'react-router-dom';
import {
  Users,
  Clock,
  Inbox,
  GitMerge,
  Upload,
  Trash2,
  Plus,
  Tag,
} from 'lucide-react';
import {
  useContactsStore,
  selectContactsMap,
  deriveContactTags,
} from '@/pages/contacts/_hooks/use-contacts-store';
import { cn } from '@/lib/utils';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  badgeColor?: 'red' | 'gray';
  active?: boolean;
  onClick: () => void;
}

function NavRow({ icon: Icon, label, count, badgeColor, active, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-[10px] py-2 pl-4 pr-3 text-left text-[13.5px] font-medium transition-colors',
        active
          ? 'bg-[rgba(20,22,26,0.07)] text-[var(--ink)]'
          : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')} />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'shrink-0 rounded-full px-1.5 text-[10px] font-medium leading-tight',
            badgeColor === 'red'
              ? 'bg-[var(--bad-fg)] text-white'
              : 'text-[var(--text-5)]',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function ContactsMiniRail() {
  const contactsMap = useContactsStore(selectContactsMap);
  const duplicates = useContactsStore((s) => s.duplicates);
  const createContact = useContactsStore((s) => s.createContact);
  const navigate = useNavigate();
  const location = useLocation();

  const contacts = Object.values(contactsMap);
  const allCount = contacts.filter((c) => !c.trashed).length;
  const trashedCount = contacts.filter((c) => c.trashed).length;
  const dupeCount = Object.values(duplicates).filter((d) => d.resolution === 'pending').length;
  const tags = deriveContactTags(contacts);

  const path = location.pathname;
  const onPath = (...arr: string[]) => arr.includes(path);

  const onNew = async () => {
    const c = await createContact({});
    navigate(`/contacts/contact/${c.id}`);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[var(--line-soft)]">
      <div className="px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={onNew}
          className="plat-btn w-full justify-center"
        >
          <Plus className="h-4 w-4" /> Create contact
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-0.5">
          <NavRow
            icon={Users}
            label="Contacts"
            count={allCount}
            active={onPath('/contacts') || onPath('/contacts/timeline')}
            onClick={() => navigate('/contacts')}
          />
          <NavRow icon={Clock} label="Frequent" onClick={() => navigate('/contacts')} />
          <NavRow icon={Inbox} label="Other contacts" onClick={() => navigate('/contacts')} />
        </div>

        <div className="plat-eyebrow mb-1.5 mt-6 px-4">Fix &amp; manage</div>
        <div className="space-y-0.5">
          <NavRow
            icon={GitMerge}
            label="Merge & fix"
            count={dupeCount}
            badgeColor="red"
            active={onPath('/contacts/duplicates')}
            onClick={() => navigate('/contacts/duplicates')}
          />
          <NavRow
            icon={Upload}
            label="Import"
            active={onPath('/contacts/import')}
            onClick={() => navigate('/contacts/import')}
          />
          <NavRow
            icon={Trash2}
            label="Trash"
            count={trashedCount}
            active={onPath('/contacts/trash')}
            onClick={() => navigate('/contacts/trash')}
          />
        </div>

        <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-4">
          <span>Labels</span>
        </div>
        <div className="space-y-0.5">
          {tags.length === 0 ? (
            <div className="px-4 text-[11px] italic text-[var(--text-5)]">No labels yet</div>
          ) : (
            tags.slice(0, 10).map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => navigate(`/contacts?tag=${encodeURIComponent(t.name)}`)}
                className="flex w-full items-center gap-3 rounded-[10px] py-2 pl-4 pr-3 text-left text-[13.5px] font-medium text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                <Tag className="h-4 w-4 shrink-0 text-[var(--text-4)]" />
                <span className="flex-1 truncate">{t.name}</span>
                <span className="text-[10px] text-[var(--text-5)]">{t.count}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}
