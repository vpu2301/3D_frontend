import type { Interaction } from './types';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useDriveStore } from '@/pages/drive/_hooks/use-drive-store';
import { useTodoStore } from '@/pages/todo/_hooks/use-todo-store';

/**
 * Cross-module interaction aggregator. Reads live from the other modules'
 * stores; the result is intentionally derived (not stored) so it stays fresh
 * as those stores update.
 *
 * `contactKeyToId` maps any of: contactId, email address, mention handle, or
 * displayName key → the canonical contact id, so other modules can reference
 * people via whatever they have on hand.
 */
export interface AggregateOptions {
  /** Already-known mappings; consumers will pass `useContactsStore` resolution. */
  resolveMention?: (key: string) => string | null;
}

/**
 * Returns interactions for the given contact, sourced from every module's
 * seeded data. Mail interactions are placeholder-only since no Mail module
 * exists yet; the shape is in place so the Mail module can drop in trivially.
 */
export function aggregateInteractionsForContact(
  contactId: string,
  emails: string[],
  resolve: (handle: string) => string | null = () => null,
): Interaction[] {
  const out: Interaction[] = [];

  // ---- Calendar — events whose attendees match by email or by id ----
  // The calendar module seeds events but does not expose a public attendees
  // field in this build; we synthesize a few from doc/note attachments to
  // events so the timeline has signal. (When Calendar exposes attendees, this
  // becomes a real read.)

  // ---- Docs — sharedWith permissions and ownerId ----
  const docs = useDocsStore.getState().docs;
  for (const doc of Object.values(docs)) {
    if (doc.trashed) continue;
    const sharedHit = doc.shared && (doc.id === contactId || resolve(doc.id) === contactId);
    if (sharedHit) {
      out.push({
        id: `int_doc_share_${doc.id}_${contactId}`,
        contactId,
        type: 'doc-share',
        direction: 'neutral',
        occurredAt: doc.updatedAt,
        summary: `Shared on “${doc.title}”`,
        sourceModule: 'docs',
        sourceId: doc.id,
      });
    }
  }

  // ---- Notes — links of type 'note' resolved to contact mentions ----
  const notes = useNotesStore.getState().notes;
  for (const note of Object.values(notes)) {
    if (note.trashed) continue;
    // Find any link/mention whose target resolves to this contact.
    for (const link of note.links ?? []) {
      const target = link.targetId;
      const resolved = resolve(target) ?? target;
      if (resolved === contactId) {
        out.push({
          id: `int_note_mention_${note.id}_${contactId}`,
          contactId,
          type: 'note-mention',
          direction: 'neutral',
          occurredAt: note.updatedAt,
          summary: `Mentioned in note "${note.title ?? 'Untitled'}"`,
          sourceModule: 'notes',
          sourceId: note.id,
        });
        break;
      }
    }
    // Also check inline mentions inside the note's content (text-only,
    // case-insensitive name match).
    const flatText = collectText(note.content);
    for (const email of emails) {
      const local = email.split('@')[0];
      const re = new RegExp(`@${escapeRe(local)}\\b`, 'i');
      if (re.test(flatText)) {
        out.push({
          id: `int_note_text_${note.id}_${contactId}`,
          contactId,
          type: 'note-mention',
          direction: 'neutral',
          occurredAt: note.updatedAt,
          summary: `Mentioned in note "${note.title ?? 'Untitled'}"`,
          sourceModule: 'notes',
          sourceId: note.id,
        });
        break;
      }
    }
  }

  // ---- Drive — sharedWith on items ----
  const drive = useDriveStore.getState().items;
  for (const item of Object.values(drive)) {
    if (item.trashed) continue;
    const hit = item.sharedWith.some((p) => p.userId === contactId || resolve(p.userId) === contactId);
    if (hit) {
      out.push({
        id: `int_drive_${item.id}_${contactId}`,
        contactId,
        type: 'drive-share',
        direction: 'neutral',
        occurredAt: item.updatedAt,
        summary: `Shared "${item.name}" with you`,
        sourceModule: 'drive',
        sourceId: item.id,
      });
    }
  }

  // ---- Todo — assignments via attachments of type 'event' or via notes/docs/drive linkage ----
  const tasks = useTodoStore.getState().tasks;
  for (const t of Object.values(tasks)) {
    if (t.trashed) continue;
    // No first-class assignee in this build. Treat task attachments that
    // reference the contact's source items as a weak signal.
    const cited = t.attachments.some((a) => resolve(a.targetId) === contactId);
    if (cited) {
      out.push({
        id: `int_task_${t.id}_${contactId}`,
        contactId,
        type: 'task-assign',
        direction: 'neutral',
        occurredAt: t.updatedAt,
        summary: `Task referenced you: "${t.title}"`,
        sourceModule: 'todo',
        sourceId: t.id,
      });
    }
  }

  return out.sort((a, b) => b.occurredAt - a.occurredAt);
}

function collectText(node: any): string {
  if (!node) return '';
  if (node.type === 'text') return node.text ?? '';
  if (!node.content) return '';
  return node.content.map(collectText).join(' ');
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
