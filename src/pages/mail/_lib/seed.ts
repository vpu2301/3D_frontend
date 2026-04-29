import type { Email, Thread, Label, Draft, SmartView, ContactRef } from './types';
import { newId } from './storage';

const DAY = 86_400_000;
const HOUR = 3_600_000;

const c = (name: string, email: string, contactId?: string): ContactRef => ({
  name,
  email,
  contactId,
});

const SELF = c('You', 'me@3days.ai', 'me');

export interface SeedBundle {
  emails: Email[];
  bodies: Record<string, string>;
  threads: Thread[];
  labels: Label[];
  drafts: Draft[];
  views: SmartView[];
}

export function buildMailSeed(): SeedBundle {
  const now = Date.now();

  const labels: Label[] = [
    { id: 'lbl_followup', name: 'Follow up', color: '#1a73e8', emoji: '⏰' },
    { id: 'lbl_receipt', name: 'Receipts', color: '#10b981', emoji: '🧾' },
    { id: 'lbl_team', name: 'Team', color: '#8b5cf6', emoji: '🧑‍🤝‍🧑' },
    { id: 'lbl_clients', name: 'Clients', color: '#f59e0b', emoji: '💼' },
  ];

  const emails: Email[] = [];
  const bodies: Record<string, string> = {};
  const drafts: Draft[] = [];

  // ---- Important conversations ----

  // Thread 1: Sarah at Acme — back-and-forth, awaiting user reply
  {
    const tid = 't_acme_q3';
    const sarah = c('Sarah Chen', 'sarah@acme.com', 'cont_sarah');
    emails.push(seedEmail({
      id: 'e_acme_1', threadId: tid, from: sarah, to: [SELF],
      subject: 'Q3 numbers — quick question',
      snippet: 'Hi — could you walk me through the Q3 forecast slide?',
      receivedAt: now - 5 * DAY,
      direction: 'incoming', category: 'important', isRead: true,
      labels: ['lbl_clients'],
    }));
    bodies['e_acme_1'] = `<p>Hi,</p><p>Could you walk me through the Q3 forecast slide? I want to make sure I'm reading the projection correctly before our board update on Friday.</p><p>Thanks,<br>Sarah</p>`;
    emails.push(seedEmail({
      id: 'e_acme_2', threadId: tid, from: SELF, to: [sarah],
      inReplyTo: 'e_acme_1',
      subject: 'Re: Q3 numbers — quick question',
      snippet: 'Sure — happy to walk through it. Available Thursday at 10?',
      receivedAt: now - 4 * DAY, sentAt: now - 4 * DAY,
      direction: 'outgoing', isRead: true,
      labels: ['lbl_clients'],
    }));
    bodies['e_acme_2'] = `<p>Sure — happy to walk through it. I'm available Thursday at 10am or Friday at 9am, your timezone. Which works?</p><p>The forecast slide bakes in three scenarios — base, upside, and downside — driven primarily by enterprise pipeline conversion rates.</p>`;
    emails.push(seedEmail({
      id: 'e_acme_3', threadId: tid, from: sarah, to: [SELF],
      inReplyTo: 'e_acme_2',
      subject: 'Re: Q3 numbers — quick question',
      snippet: 'Thursday 10am works great. One more thing — could you also share the underlying spreadsheet?',
      receivedAt: now - 6 * HOUR,
      direction: 'incoming', isRead: false, category: 'important',
      attachments: [],
      labels: ['lbl_clients'],
      aiTone: { tone: 'friendly', confidence: 0.82 },
    }));
    bodies['e_acme_3'] = `<p>Thursday 10am works great — calendar invite to follow.</p><p>One more thing: could you share the underlying spreadsheet so our finance team can spot-check the assumptions?</p><p>— Sarah</p>`;
  }

  // Thread 2: Felix on design review with attachment, has linked Doc
  {
    const tid = 't_felix_design';
    const felix = c('Felix Mendoza', 'felix@mendoza.studio', 'cont_felix');
    emails.push(seedEmail({
      id: 'e_felix_1', threadId: tid, from: felix, to: [SELF],
      subject: 'Design review v2 — ready for your eyes',
      snippet: 'Hey — pushed v2 of the marketing site, attached the brief.',
      receivedAt: now - 2 * DAY,
      direction: 'incoming', category: 'important', isRead: false,
      attachments: [
        { driveFileId: 'drive_brief_v2', filename: 'design-brief-v2.pdf', mimeType: 'application/pdf', size: 482_104 },
      ],
      contextRefs: [{ type: 'doc', targetId: 'doc_marketing_site', label: 'Marketing site copy' }],
      labels: ['lbl_team'],
      aiTone: { tone: 'casual', confidence: 0.74 },
    }));
    bodies['e_felix_1'] = `<p>Hey,</p><p>Pushed v2 of the marketing site mocks based on Tuesday's review. Brief is attached and the copy doc is referenced below.</p><p>Main changes:</p><ul><li>Hero treatment is tighter — product first, not story first</li><li>Pricing comparison row removed (your call)</li><li>Mobile nav simplified to two tiers</li></ul><p>Curious what you think. — Felix</p>`;
  }

  // Thread 3: Diana from Atlas VC — important, awaiting reply
  {
    const tid = 't_diana_term';
    const diana = c('Diana Park', 'diana@atlasvc.com', 'cont_diana');
    emails.push(seedEmail({
      id: 'e_diana_1', threadId: tid, from: diana, to: [SELF],
      subject: 'Term sheet revisions — pls review',
      snippet: 'Updated the term sheet based on Tuesday\'s call. Highlights inline.',
      receivedAt: now - 1 * DAY,
      direction: 'incoming', category: 'important', isRead: false,
      attachments: [
        { driveFileId: 'drive_termsheet', filename: 'TermSheet_v3.pdf', mimeType: 'application/pdf', size: 311_842 },
      ],
      labels: ['lbl_clients', 'lbl_followup'],
      aiTone: { tone: 'formal', confidence: 0.91 },
    }));
    bodies['e_diana_1'] = `<p>Hi,</p><p>Updated the term sheet based on Tuesday's call. Highlights inline:</p><ul><li>Pre-money increased to $X (per discussion)</li><li>Pro-rata clause clarified</li><li>Liquidation preference unchanged</li></ul><p>Please review by EOD Wednesday so we can move to signing this week.</p><p>Best,<br>Diana</p>`;
  }

  // Thread 4: Lin (Stanford) — referenced note, two-way
  {
    const tid = 't_lin_research';
    const lin = c('Lin Wei', 'lin@stanford.edu', 'cont_lin');
    emails.push(seedEmail({
      id: 'e_lin_1', threadId: tid, from: lin, to: [SELF],
      subject: 'Re: paper draft — comments',
      snippet: 'Comments on §3 attached. Mainly concerned about the eval methodology.',
      receivedAt: now - 3 * DAY,
      direction: 'incoming', category: 'important', isRead: true,
      contextRefs: [{ type: 'note', targetId: 'note_research_eval', label: 'Eval methodology notes' }],
    }));
    bodies['e_lin_1'] = `<p>Comments on §3 inline below. Main concern: the eval methodology mixes two cohorts (Cohort A pre-rollout vs B post-rollout) and I think this confounds the treatment effect with seasonal drift.</p><p>I left a longer write-up in the linked note.</p><p>— Lin</p>`;
    emails.push(seedEmail({
      id: 'e_lin_2', threadId: tid, from: SELF, to: [lin],
      inReplyTo: 'e_lin_1',
      subject: 'Re: paper draft — comments',
      snippet: 'Good catch on the cohorting issue. I\'ll re-run with matched samples.',
      receivedAt: now - 2 * DAY - 4 * HOUR, sentAt: now - 2 * DAY - 4 * HOUR,
      direction: 'outgoing', isRead: true,
    }));
    bodies['e_lin_2'] = `<p>Good catch on the cohorting issue. I'll re-run with matched samples and send updated tables by Monday.</p>`;
  }

  // Thread 5: Internal team — Priya
  {
    const tid = 't_priya_kickoff';
    const priya = c('Priya Iyer', 'priya@3days.ai', 'cont_priya');
    emails.push(seedEmail({
      id: 'e_priya_1', threadId: tid, from: priya, to: [SELF, c('Jules', 'jules@3days.ai'), c('Emma', 'emma@3days.ai')],
      subject: 'Kickoff — Project Apollo',
      snippet: 'Sharing the brief + roles doc ahead of Monday\'s kickoff.',
      receivedAt: now - 7 * DAY,
      direction: 'incoming', category: 'important', isRead: true,
      labels: ['lbl_team'],
      contextRefs: [{ type: 'doc', targetId: 'doc_apollo_brief', label: 'Apollo brief' }],
    }));
    bodies['e_priya_1'] = `<p>Team — sharing the brief and roles doc ahead of Monday's kickoff.</p><p>Read in advance, please. Agenda is short: scope confirmation, milestones, owners.</p><p>— P</p>`;
  }

  // Thread 6: Calendar invite from Yusuf
  {
    const tid = 't_yusuf_meeting';
    const yusuf = c('Yusuf Ahmed', 'yusuf@apollohealth.io', 'cont_yusuf');
    emails.push(seedEmail({
      id: 'e_yusuf_1', threadId: tid, from: yusuf, to: [SELF],
      subject: 'Invitation: Apollo strategy sync — Mon 2pm',
      snippet: 'You\'re invited to: Apollo strategy sync. Mon 2pm–3pm.',
      receivedAt: now - 18 * HOUR,
      direction: 'incoming', category: 'calendar', isRead: false,
      rsvp: {
        eventTitle: 'Apollo strategy sync',
        proposedStart: now + 3 * DAY + 14 * HOUR,
        proposedEnd: now + 3 * DAY + 15 * HOUR,
        organizer: yusuf,
      },
    }));
    bodies['e_yusuf_1'] = `<p><strong>Apollo strategy sync</strong></p><p>When: Monday, 2:00pm–3:00pm<br>Where: Zoom (link on accept)<br>Organizer: Yusuf Ahmed</p><p>Agenda: review Q4 scope, owner assignments, blockers.</p>`;
  }

  // Thread 7: Calendar reschedule
  {
    const tid = 't_alex_reschedule';
    const alex = c('Alex Park', 'alex@3days.ai', 'cont_alex');
    emails.push(seedEmail({
      id: 'e_alex_1', threadId: tid, from: alex, to: [SELF],
      subject: 'Rescheduling our 1:1 — Tue or Wed?',
      snippet: 'I\'ve got a conflict Thursday — could we move to Tue or Wed?',
      receivedAt: now - 4 * HOUR,
      direction: 'incoming', category: 'calendar', isRead: false,
    }));
    bodies['e_alex_1'] = `<p>Hey — I've got a hard conflict Thursday morning. Could we move our 1:1 to Tue 11am or Wed 3pm?</p><p>— Alex</p>`;
  }

  // ---- Updates / Newsletters / Receipts ----

  {
    const stripe = c('Stripe', 'receipts@stripe.com');
    emails.push(seedEmail({
      id: 'e_stripe_1', threadId: 't_stripe_1', from: stripe, to: [SELF],
      subject: 'Receipt for your subscription — $89.00',
      snippet: 'Your subscription renewed successfully.',
      receivedAt: now - 6 * DAY,
      direction: 'incoming', category: 'updates', isRead: true,
      labels: ['lbl_receipt'],
    }));
    bodies['e_stripe_1'] = `<p>Your subscription renewed successfully.</p><p>Total: <strong>$89.00 USD</strong> · Card ending 4242</p>`;
  }
  {
    const gh = c('GitHub', 'noreply@github.com');
    emails.push(seedEmail({
      id: 'e_gh_1', threadId: 't_gh_1', from: gh, to: [SELF],
      subject: '[3days/platform] PR #248: Add Mail module',
      snippet: 'Devansh opened PR #248 in 3days/platform.',
      receivedAt: now - 3 * HOUR,
      direction: 'incoming', category: 'updates', isRead: false,
    }));
    bodies['e_gh_1'] = `<p>Devansh opened pull request #248 in 3days/platform.</p><blockquote>Add Mail module — initial scaffolding for the AI-native email surface.</blockquote>`;
  }
  {
    const linear = c('Linear', 'updates@linear.app');
    emails.push(seedEmail({
      id: 'e_linear_1', threadId: 't_linear_1', from: linear, to: [SELF],
      subject: 'Weekly digest — 12 issues moved to In Review',
      snippet: 'Here\'s what your team shipped this week.',
      receivedAt: now - 2 * DAY,
      direction: 'incoming', category: 'updates', isRead: true,
    }));
    bodies['e_linear_1'] = `<h3>Weekly summary</h3><ul><li>12 issues moved to In Review</li><li>8 issues completed</li><li>3 new bugs opened</li></ul>`;
  }
  {
    const aws = c('AWS Billing', 'billing@aws.amazon.com');
    emails.push(seedEmail({
      id: 'e_aws_1', threadId: 't_aws_1', from: aws, to: [SELF],
      subject: 'Your AWS invoice for April 2026',
      snippet: 'Total: $1,284.32. Auto-pay scheduled for May 5.',
      receivedAt: now - 12 * DAY,
      direction: 'incoming', category: 'updates', isRead: true,
      labels: ['lbl_receipt'],
    }));
    bodies['e_aws_1'] = `<p>Your AWS invoice for April 2026 is ready.</p><p>Total: <strong>$1,284.32</strong>. Auto-pay scheduled for May 5.</p>`;
  }
  {
    const nyt = c('The New York Times', 'newsletter@nytimes.com');
    emails.push(seedEmail({
      id: 'e_nyt_1', threadId: 't_nyt_1', from: nyt, to: [SELF],
      subject: 'The Morning: What you need to know today',
      snippet: 'A look at the day ahead.',
      receivedAt: now - 8 * HOUR,
      direction: 'incoming', category: 'updates', isRead: false,
    }));
    bodies['e_nyt_1'] = `<p>Today's top stories…</p>`;
  }
  {
    const substack = c('Stratechery', 'ben@stratechery.com');
    emails.push(seedEmail({
      id: 'e_substack_1', threadId: 't_substack_1', from: substack, to: [SELF],
      subject: 'The Aggregator and the Distribution Layer',
      snippet: 'A subscriber-only essay on how distribution shifts in AI.',
      receivedAt: now - 1 * DAY,
      direction: 'incoming', category: 'updates', isRead: false,
    }));
    bodies['e_substack_1'] = `<p>This week's essay…</p>`;
  }

  // ---- Promos ----

  {
    const figma = c('Figma', 'team@figma.com');
    emails.push(seedEmail({
      id: 'e_figma_promo', threadId: 't_figma_promo', from: figma, to: [SELF],
      subject: 'Limited-time: 20% off Figma Organization',
      snippet: 'Upgrade your team with two months free when you commit annually.',
      receivedAt: now - 11 * HOUR,
      direction: 'incoming', category: 'promos', isRead: false,
    }));
    bodies['e_figma_promo'] = `<p>Limited time offer: <strong>20% off</strong> Figma Organization annual plans.</p>`;
  }
  {
    const aa = c('American Airlines', 'mileage@aa.com');
    emails.push(seedEmail({
      id: 'e_aa_promo', threadId: 't_aa_promo', from: aa, to: [SELF],
      subject: 'Earn 50,000 bonus miles this spring',
      snippet: 'Limited-time offer for AAdvantage members.',
      receivedAt: now - 4 * DAY,
      direction: 'incoming', category: 'promos', isRead: true,
    }));
    bodies['e_aa_promo'] = `<p>Earn 50,000 bonus miles when you book by May 31.</p>`;
  }
  {
    const dc = c('Discount Tire', 'deals@discounttire.com');
    emails.push(seedEmail({
      id: 'e_dc_promo', threadId: 't_dc_promo', from: dc, to: [SELF],
      subject: 'Spring tire sale — up to $100 back',
      snippet: 'Mail-in rebate on a set of 4 select tires.',
      receivedAt: now - 6 * DAY,
      direction: 'incoming', category: 'promos', isRead: true,
    }));
    bodies['e_dc_promo'] = `<p>Up to $100 back on select tires.</p>`;
  }

  // ---- Outgoing emails awaiting reply (for follow-ups) ----

  {
    const robin = c('Robin Voss', 'robin@vossco.com', 'cont_robin');
    emails.push(seedEmail({
      id: 'e_robin_out', threadId: 't_robin_out', from: SELF, to: [robin],
      subject: 'Partnership intro — would love your thoughts',
      snippet: 'Sending the deck I mentioned. Curious if there\'s a fit.',
      receivedAt: now - 5 * DAY, sentAt: now - 5 * DAY,
      direction: 'outgoing', isRead: true,
    }));
    bodies['e_robin_out'] = `<p>Hi Robin — sending the deck I mentioned at the conference. Curious if there's a fit on the platform side.</p><p>Best, You</p>`;
  }
  {
    const henrik = c('Henrik Aalborg', 'henrik@aalborg.studio', 'cont_henrik');
    emails.push(seedEmail({
      id: 'e_henrik_out', threadId: 't_henrik_out', from: SELF, to: [henrik],
      subject: 'Following up on the brand refresh proposal',
      snippet: 'Wanted to circle back on the proposal — any questions?',
      receivedAt: now - 8 * DAY, sentAt: now - 8 * DAY,
      direction: 'outgoing', isRead: true,
      labels: ['lbl_followup'],
    }));
    bodies['e_henrik_out'] = `<p>Hi Henrik — circling back on the brand refresh proposal I sent two weeks ago. Any questions?</p>`;
  }
  {
    const ines = c('Ines Costa', 'ines@costaco.pt', 'cont_ines');
    emails.push(seedEmail({
      id: 'e_ines_out', threadId: 't_ines_out', from: SELF, to: [ines],
      subject: 'Re: Q4 planning — your input?',
      snippet: 'When you have a moment — any thoughts on the Q4 plan?',
      receivedAt: now - 6 * DAY, sentAt: now - 6 * DAY,
      direction: 'outgoing', isRead: true,
    }));
    bodies['e_ines_out'] = `<p>Hi Ines — when you have a moment, any thoughts on the Q4 plan I shared? Trying to lock the roadmap by end of week.</p>`;
  }
  {
    const taylor = c('Taylor Reyes', 'taylor@apollohealth.io', 'cont_taylor');
    emails.push(seedEmail({
      id: 'e_taylor_out', threadId: 't_taylor_out', from: SELF, to: [taylor],
      subject: 'Renewal terms — proposal',
      snippet: 'Sharing renewal terms for our review.',
      receivedAt: now - 4 * DAY, sentAt: now - 4 * DAY,
      direction: 'outgoing', isRead: true,
    }));
    bodies['e_taylor_out'] = `<p>Hi Taylor — sharing renewal terms for our discussion next week.</p>`;
  }
  {
    const nina = c('Nina Park', 'nina@acme.com', 'cont_nina');
    emails.push(seedEmail({
      id: 'e_nina_out', threadId: 't_nina_out', from: SELF, to: [nina],
      subject: 'Vendor security questionnaire',
      snippet: 'Returning the security questionnaire — let me know if anything\'s missing.',
      receivedAt: now - 9 * DAY, sentAt: now - 9 * DAY,
      direction: 'outgoing', isRead: true,
    }));
    bodies['e_nina_out'] = `<p>Hi Nina — returning the security questionnaire. Let me know if anything's missing.</p>`;
  }

  // ---- Sent (regular history) ----
  {
    const omar = c('Omar Khalid', 'omar@3days.ai', 'cont_omar');
    emails.push(seedEmail({
      id: 'e_omar_out', threadId: 't_omar_out', from: SELF, to: [omar],
      subject: 'Notes from this morning\'s standup',
      snippet: 'Highlights and blockers below.',
      receivedAt: now - 1 * DAY - 2 * HOUR, sentAt: now - 1 * DAY - 2 * HOUR,
      direction: 'outgoing', isRead: true,
    }));
    bodies['e_omar_out'] = `<p>Highlights and blockers from this morning's standup below.</p>`;
  }

  // ---- Drafts ----
  drafts.push({
    id: 'draft_1',
    subject: 'Re: Q3 numbers — quick question',
    threadId: 't_acme_q3',
    replyToEmailId: 'e_acme_3',
    to: [c('Sarah Chen', 'sarah@acme.com', 'cont_sarah')],
    cc: [], bcc: [],
    bodyHtml: '<p>Hi Sarah — sharing the spreadsheet now</p>',
    attachments: [],
    contextRefs: [],
    createdAt: now - 1 * HOUR,
    updatedAt: now - 1 * HOUR,
  });
  drafts.push({
    id: 'draft_2',
    subject: 'Intro: Felix → Henrik',
    to: [c('Felix Mendoza', 'felix@mendoza.studio'), c('Henrik Aalborg', 'henrik@aalborg.studio')],
    cc: [], bcc: [],
    bodyHtml: '<p>Felix, Henrik — wanted to connect you both. Felix is a designer I trust, Henrik runs a brand studio in Copenhagen.</p>',
    attachments: [],
    contextRefs: [],
    createdAt: now - 3 * HOUR,
    updatedAt: now - 30 * 60_000,
  });
  drafts.push({
    id: 'draft_3',
    subject: '',
    to: [],
    cc: [], bcc: [],
    bodyHtml: '',
    attachments: [],
    contextRefs: [],
    createdAt: now - 5 * 60_000,
    updatedAt: now - 5 * 60_000,
  });

  // ---- Scheduled emails (sitting in queue) ----
  {
    const jordan = c('Jordan Liu', 'jordan@protonmail.com', 'cont_jordan');
    emails.push(seedEmail({
      id: 'e_sched_1', threadId: 't_sched_1', from: SELF, to: [jordan],
      subject: 'Birthday plans?',
      snippet: 'Hey — what are you thinking for your birthday?',
      receivedAt: now, sentAt: undefined,
      direction: 'outgoing', isRead: true,
      isScheduled: true, scheduledFor: now + 2 * DAY,
    }));
    bodies['e_sched_1'] = `<p>Hey Jordan — what are you thinking for your birthday this year? Up for dinner Friday?</p>`;
  }
  {
    const kai = c('Kai Holmes', 'kai@holdinc.com', 'cont_kai');
    emails.push(seedEmail({
      id: 'e_sched_2', threadId: 't_sched_2', from: SELF, to: [kai],
      subject: 'Quarterly update',
      snippet: 'Wanted to share a quick update on where we landed last quarter.',
      receivedAt: now, sentAt: undefined,
      direction: 'outgoing', isRead: true,
      isScheduled: true, scheduledFor: now + 1 * DAY + 6 * HOUR,
    }));
    bodies['e_sched_2'] = `<p>Wanted to share a quick update on where we landed last quarter…</p>`;
  }

  // ---- Snoozed ----
  {
    const helena = c('Helena Park', 'helena@webflow.com', 'cont_helena');
    emails.push(seedEmail({
      id: 'e_snooze_1', threadId: 't_snooze_1', from: helena, to: [SELF],
      subject: 'Re: contract redlines',
      snippet: 'Updated redlines attached.',
      receivedAt: now - 2 * DAY,
      direction: 'incoming', isRead: true, category: 'important',
      isSnoozed: true, snoozeUntil: now + 1 * DAY,
    }));
    bodies['e_snooze_1'] = `<p>Updated redlines attached.</p>`;
  }

  // Build threads from emails
  const threadsMap = new Map<string, Email[]>();
  for (const e of emails) {
    if (!threadsMap.has(e.threadId)) threadsMap.set(e.threadId, []);
    threadsMap.get(e.threadId)!.push(e);
  }
  const threads: Thread[] = Array.from(threadsMap.entries()).map(([tid, list]) => {
    list.sort((a, b) => a.receivedAt - b.receivedAt);
    const last = list[list.length - 1];
    const participantsByEmail = new Map<string, ContactRef>();
    for (const m of list) {
      participantsByEmail.set(m.from.email, m.from);
      for (const r of [...m.to, ...m.cc]) participantsByEmail.set(r.email, r);
    }
    const awaitingReplyFromUser = last.direction === 'incoming' && !last.isTrashed;
    const awaitingReplyFromOthers =
      last.direction === 'outgoing' &&
      now - (last.sentAt ?? last.receivedAt) > 3 * DAY;
    return {
      id: tid,
      subject: list[0].subject.replace(/^re:\s*/i, ''),
      participants: Array.from(participantsByEmail.values()),
      emailIds: list.map((m) => m.id),
      lastMessageAt: last.receivedAt,
      hasUnread: list.some((m) => !m.isRead && m.direction === 'incoming'),
      hasAttachments: list.some((m) => m.attachments.length > 0),
      awaitingReplyFromUser,
      awaitingReplyFromOthers,
    };
  });

  const views: SmartView[] = [
    {
      id: 'view_awaiting',
      name: 'Awaiting my reply',
      definition: 'Threads where the latest message is incoming and I haven\'t responded.',
      isAiCurated: false,
      builtInKey: 'awaiting-reply',
    },
    {
      id: 'view_sent_awaiting',
      name: 'Awaiting their reply',
      definition: 'Sent emails with no response after 3 days.',
      isAiCurated: false,
      builtInKey: 'sent-awaiting',
    },
    {
      id: 'view_mentions',
      name: 'Mentions me directly',
      definition: 'Emails where I\'m on the To/Cc line, not a bulk recipient.',
      isAiCurated: false,
      builtInKey: 'mentions-me',
    },
    {
      id: 'view_vips',
      name: 'VIPs',
      definition: 'Top correspondents by frequency.',
      isAiCurated: false,
      builtInKey: 'vips',
    },
  ];

  return { emails, bodies, threads, labels, drafts, views };
}

interface SeedEmailInput {
  id: string;
  threadId: string;
  inReplyTo?: string;
  from: ContactRef;
  to: ContactRef[];
  cc?: ContactRef[];
  subject: string;
  snippet: string;
  receivedAt: number;
  sentAt?: number;
  direction: 'incoming' | 'outgoing';
  category?: Email['category'];
  labels?: string[];
  isRead?: boolean;
  attachments?: Email['attachments'];
  contextRefs?: Email['contextRefs'];
  rsvp?: Email['rsvp'];
  aiTone?: Email['aiTone'];
  isSnoozed?: boolean;
  snoozeUntil?: number;
  isScheduled?: boolean;
  scheduledFor?: number;
}

function seedEmail(input: SeedEmailInput): Email {
  return {
    id: input.id,
    threadId: input.threadId,
    inReplyTo: input.inReplyTo,
    from: input.from,
    to: input.to,
    cc: input.cc ?? [],
    bcc: [],
    subject: input.subject,
    snippet: input.snippet,
    hasHtml: true,
    attachments: input.attachments ?? [],
    contextRefs: input.contextRefs ?? [],
    receivedAt: input.receivedAt,
    sentAt: input.sentAt,
    direction: input.direction,
    labels: input.labels ?? [],
    category: input.category,
    aiTone: input.aiTone,
    rsvp: input.rsvp,
    isRead: input.isRead ?? input.direction === 'outgoing',
    isStarred: false,
    isSnoozed: input.isSnoozed ?? false,
    snoozeUntil: input.snoozeUntil,
    isScheduled: input.isScheduled ?? false,
    scheduledFor: input.scheduledFor,
    isDraft: false,
    isSpam: false,
    isTrashed: false,
  };
}
