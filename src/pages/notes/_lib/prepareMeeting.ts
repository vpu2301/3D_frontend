/**
 * "Prepare for a meeting" — the action that makes the matter page a workflow
 * rather than a dashboard.
 *
 * It builds the document the user would otherwise assemble by hand from five
 * open notes: what I owe, what they owe me, what we last decided, and an empty
 * space to write in. The obligations come across as **task items**, so ticking
 * one in the new note is a real checkbox, and each carries its owner and due
 * date as text — the outcome entity itself stays where it was, on the note that
 * produced it. Copying obligations into a second place is how two sources of
 * truth start.
 *
 * The heading order matches the matter page, because the person reading this
 * note five minutes later is the person who just looked at that page.
 */

import type { JSONContent } from '@tiptap/react';
import type { MatterOutcome, MatterView } from '@/pages/notes/_lib/apiClient';
import { formatDue, ownerLabel } from '@/pages/notes/_lib/outcomes';

function heading(text: string, level = 2): JSONContent {
  return { type: 'heading', attrs: { level }, content: [{ type: 'text', text }] };
}

function paragraph(text = ''): JSONContent {
  return text ? { type: 'paragraph', content: [{ type: 'text', text }] } : { type: 'paragraph' };
}

/** One obligation as a checkbox, with the context that makes it actionable. */
function taskItem(outcome: MatterOutcome): JSONContent {
  const suffix = [outcome.owedBy ? ownerLabel(outcome.owedBy) : null, formatDue(outcome)]
    .filter(Boolean)
    .join(' · ');
  return {
    type: 'taskItem',
    attrs: { checked: false },
    content: [
      {
        type: 'paragraph',
        content: [{ type: 'text', text: suffix ? `${outcome.text} — ${suffix}` : outcome.text }],
      },
    ],
  };
}

function taskList(items: MatterOutcome[]): JSONContent {
  return { type: 'taskList', content: items.map(taskItem) };
}

export function prepareMeetingDocument(view: MatterView): JSONContent {
  const mine = view.openObligations?.mine ?? [];
  const theirs = view.openObligations?.theirs ?? [];
  const decisions = view.recentDecisions.slice(0, 5);

  const content: JSONContent[] = [];

  if (mine.length > 0) {
    content.push(heading('What I owe'), taskList(mine));
  }
  if (theirs.length > 0) {
    content.push(heading('What I am owed'), taskList(theirs));
  }
  if (decisions.length > 0) {
    content.push(heading('Where we left it'));
    content.push({
      type: 'bulletList',
      content: decisions.map((decision) => ({
        type: 'listItem',
        content: [paragraph(decision.text)],
      })),
    });
  }

  // Always last, always present: the note has to be somewhere to write, not only
  // something to read. An empty paragraph is where the caret lands.
  content.push(heading('Notes'), paragraph());

  if (content.length === 2) {
    // Nothing outstanding — say so rather than opening a note whose only content
    // is a heading, which reads like something failed.
    return {
      type: 'doc',
      content: [
        paragraph(`Nothing outstanding on ${view.matter.label} — starting from a blank page.`),
        paragraph(),
      ],
    };
  }

  return { type: 'doc', content };
}
