import type { Contact, Group, ContactSmartView } from './types';

const now = Date.now();
const day = 86_400_000;

let counter = 0;
const id = (prefix: string) => `${prefix}_${++counter}_${Math.random().toString(36).slice(2, 7)}`;

const USER_DOMAIN = '3days.ai';

function mk(over: Partial<Contact>): Contact {
  const c: Contact = {
    id: id('contact'),
    firstName: '',
    lastName: '',
    emails: [],
    phones: [],
    urls: [],
    addresses: [],
    importantDates: [],
    customFields: [],
    tags: [],
    groupIds: [],
    starred: false,
    isExternal: false,
    linkedContactIds: [],
    source: 'manual',
    trashed: false,
    createdAt: now - 30 * day,
    updatedAt: now - 1 * day,
    ...over,
  };
  // Mark external if primary email's domain is not the user's
  const primary = c.emails.find((e) => e.primary) ?? c.emails[0];
  if (primary?.value && !over.isExternal) {
    const domain = primary.value.split('@')[1]?.toLowerCase() ?? '';
    c.isExternal = !!domain && domain !== USER_DOMAIN;
  }
  return c;
}

export function buildContactsSeed(): {
  contacts: Contact[];
  groups: Group[];
  smartViews: ContactSmartView[];
} {
  const contacts: Contact[] = [
    // ---- Internal collaborators (referenced in seeded docs/notes) ----
    mk({
      id: 'c_sam',
      firstName: 'Sam',
      lastName: 'Patel',
      organization: '3days.ai',
      title: 'Engineering Lead',
      pronouns: 'he/him',
      emails: [
        { value: 'sam@3days.ai', label: 'work', primary: true },
        { value: 'sampatel@gmail.com', label: 'personal' },
      ],
      phones: [{ value: '+1 415 555 0102', label: 'mobile', primary: true }],
      tags: ['engineering', 'q2-launch'],
      starred: true,
    }),
    mk({
      id: 'c_priya',
      firstName: 'Priya',
      lastName: 'Iyer',
      organization: '3days.ai',
      title: 'Senior Engineer',
      pronouns: 'she/her',
      emails: [{ value: 'priya@3days.ai', label: 'work', primary: true }],
      phones: [{ value: '+1 415 555 0117', label: 'mobile', primary: true }],
      tags: ['engineering'],
    }),
    mk({
      id: 'c_jules',
      firstName: 'Jules',
      lastName: 'Romero',
      organization: '3days.ai',
      title: 'Designer',
      pronouns: 'they/them',
      emails: [{ value: 'jules@3days.ai', label: 'work', primary: true }],
      tags: ['design'],
    }),
    mk({
      id: 'c_emma',
      firstName: 'Emma',
      lastName: 'Carter',
      organization: '3days.ai',
      title: 'Product Manager',
      pronouns: 'she/her',
      emails: [{ value: 'emma@3days.ai', label: 'work', primary: true }],
      tags: ['product', 'q2-launch'],
      starred: true,
    }),
    mk({
      id: 'c_alex',
      firstName: 'Alex',
      lastName: 'Tan',
      organization: '3days.ai',
      title: 'CTO',
      pronouns: 'he/him',
      emails: [{ value: 'alex@3days.ai', label: 'work', primary: true }],
      tags: ['leadership'],
      starred: true,
    }),
    mk({
      id: 'c_nora',
      firstName: 'Nora',
      lastName: 'Lindqvist',
      organization: '3days.ai',
      title: 'Researcher',
      emails: [{ value: 'nora@3days.ai', label: 'work', primary: true }],
      tags: ['research'],
    }),
    mk({
      id: 'c_omar',
      firstName: 'Omar',
      lastName: 'Khoury',
      organization: '3days.ai',
      title: 'Designer',
      emails: [{ value: 'omar@3days.ai', label: 'work', primary: true }],
      tags: ['design'],
    }),

    // ---- External / customers / partners ----
    mk({
      id: 'c_sarah_acme',
      firstName: 'Sarah',
      lastName: 'Reyes',
      organization: 'Acme Corp',
      title: 'Head of Design',
      pronouns: 'she/her',
      emails: [{ value: 'sarah@acme.com', label: 'work', primary: true }],
      phones: [{ value: '+1 212 555 0299', label: 'mobile', primary: true }],
      addresses: [{ value: '500 5th Ave, New York NY', label: 'work' }],
      tags: ['acme', 'design-review'],
      starred: true,
    }),
    mk({
      id: 'c_acme_legal',
      firstName: 'Mike',
      lastName: 'Tomas',
      organization: 'Acme Corp',
      title: 'General Counsel',
      emails: [{ value: 'legal@acme.com', label: 'work', primary: true }],
      tags: ['acme', 'contract'],
    }),
    mk({
      id: 'c_felix',
      firstName: 'Felix',
      lastName: 'Mendoza',
      organization: 'Mendoza Studio',
      title: 'Founder',
      emails: [{ value: 'felix@mendoza.studio', label: 'work', primary: true }],
      tags: ['friend', 'design'],
    }),
    mk({
      id: 'c_lin',
      firstName: 'Lin',
      lastName: 'Chen',
      organization: 'Stanford',
      title: 'PhD candidate',
      emails: [{ value: 'lin@stanford.edu', label: 'work', primary: true }],
      tags: ['research'],
    }),
    mk({
      id: 'c_diana',
      firstName: 'Diana',
      lastName: 'Park',
      organization: 'Atlas Ventures',
      title: 'Investor',
      emails: [{ value: 'diana@atlasvc.com', label: 'work', primary: true }],
      tags: ['investor'],
      starred: true,
    }),
    mk({
      id: 'c_marco',
      firstName: 'Marco',
      lastName: 'Bianchi',
      organization: 'Atlas Ventures',
      title: 'Principal',
      emails: [{ value: 'marco@atlasvc.com', label: 'work', primary: true }],
      tags: ['investor'],
    }),
    mk({
      id: 'c_yusuf',
      firstName: 'Yusuf',
      lastName: 'Ali',
      organization: 'Apollo Health',
      title: 'CTO',
      emails: [{ value: 'yusuf@apollohealth.io', label: 'work', primary: true }],
      tags: ['apollo'],
    }),
    mk({
      id: 'c_taylor',
      firstName: 'Taylor',
      lastName: 'Brown',
      organization: 'Apollo Health',
      title: 'Engineering Manager',
      emails: [{ value: 'taylor@apollohealth.io', label: 'work', primary: true }],
      tags: ['apollo'],
    }),

    // ---- Personal / non-work ----
    mk({
      id: 'c_mom',
      firstName: 'Eleanor',
      lastName: 'Pugachova',
      displayName: 'Mom',
      emails: [{ value: 'eleanor.p@example.com', label: 'personal', primary: true }],
      phones: [{ value: '+1 415 555 0144', label: 'mobile', primary: true }],
      importantDates: [{ value: new Date('1965-08-12').getTime(), label: 'Birthday' }],
      tags: ['family'],
      groupIds: ['g_family'],
      starred: true,
    }),
    mk({
      id: 'c_brother',
      firstName: 'Daniel',
      lastName: 'Pugachov',
      emails: [{ value: 'daniel.p@example.com', label: 'personal', primary: true }],
      phones: [{ value: '+1 415 555 0188', label: 'mobile', primary: true }],
      tags: ['family'],
      groupIds: ['g_family'],
    }),
    mk({
      id: 'c_riley',
      firstName: 'Riley',
      lastName: 'Nakamura',
      emails: [{ value: 'riley@gmail.com', label: 'personal', primary: true }],
      tags: ['friend'],
      groupIds: ['g_friends'],
    }),
    mk({
      id: 'c_jordan',
      firstName: 'Jordan',
      lastName: 'Mason',
      emails: [{ value: 'jordan@protonmail.com', label: 'personal', primary: true }],
      tags: ['friend'],
      groupIds: ['g_friends'],
    }),
    mk({
      id: 'c_kim',
      firstName: 'Kim',
      lastName: 'Boateng',
      emails: [{ value: 'kim@gmail.com', label: 'personal', primary: true }],
      tags: ['gym', 'friend'],
      groupIds: ['g_friends'],
    }),
    mk({
      id: 'c_dr',
      firstName: 'Dr. Avery',
      lastName: 'Lin',
      organization: 'Bayview Medical',
      title: 'Family Physician',
      emails: [{ value: 'avery.lin@bayview.health', label: 'work', primary: true }],
      tags: ['health'],
    }),

    // ---- "Going stale" — old, no recent interaction ----
    mk({
      id: 'c_stale_1',
      firstName: 'Robin',
      lastName: 'Voss',
      organization: 'Voss Co',
      title: 'Founder',
      emails: [{ value: 'robin@vossco.com', label: 'work', primary: true }],
      tags: ['old-coworker'],
      updatedAt: now - 110 * day,
    }),
    mk({
      id: 'c_stale_2',
      firstName: 'Maya',
      lastName: 'Iqbal',
      organization: 'Old Friends Group',
      emails: [{ value: 'maya.iqbal@gmail.com', label: 'personal', primary: true }],
      tags: ['friend', 'school'],
      updatedAt: now - 90 * day,
    }),
    mk({
      id: 'c_stale_3',
      firstName: 'Henrik',
      lastName: 'Sørensen',
      organization: 'Aalborg Studio',
      title: 'Architect',
      emails: [{ value: 'henrik@aalborg.studio', label: 'work', primary: true }],
      tags: ['acquaintance'],
      updatedAt: now - 140 * day,
    }),
    mk({
      id: 'c_stale_4',
      firstName: 'Ines',
      lastName: 'Costa',
      organization: 'Costa & Co',
      title: 'Lawyer',
      emails: [{ value: 'ines@costaco.pt', label: 'work', primary: true }],
      tags: ['contract', 'old'],
      updatedAt: now - 200 * day,
    }),
    mk({
      id: 'c_stale_5',
      firstName: 'Peter',
      lastName: 'Quinn',
      emails: [{ value: 'pquinn@yahoo.com', label: 'personal', primary: true }],
      tags: ['friend'],
      updatedAt: now - 75 * day,
    }),

    // ---- Duplicate pair 1: same name, different emails ----
    mk({
      id: 'c_dupe1_a',
      firstName: 'Maria',
      lastName: 'Hernandez',
      organization: 'Northwind',
      emails: [{ value: 'maria@northwind.com', label: 'work', primary: true }],
      title: 'Account Executive',
      updatedAt: now - 8 * day,
    }),
    mk({
      id: 'c_dupe1_b',
      firstName: 'Maria',
      lastName: 'Hernandez',
      organization: 'Northwind',
      emails: [{ value: 'maria.hernandez@northwind.com', label: 'work', primary: true }],
      title: 'Account Exec',
      phones: [{ value: '+1 408 555 0143', label: 'mobile', primary: true }],
      updatedAt: now - 4 * day,
    }),

    // ---- Duplicate pair 2: shared email ----
    mk({
      id: 'c_dupe2_a',
      firstName: 'Chris',
      lastName: 'Wells',
      emails: [{ value: 'chris@wellsdesign.co', label: 'work', primary: true }],
      organization: 'Wells Design',
    }),
    mk({
      id: 'c_dupe2_b',
      firstName: 'Christopher',
      lastName: 'Wells',
      emails: [{ value: 'chris@wellsdesign.co', label: 'work', primary: true }],
      organization: 'Wells Design Co.',
      title: 'Principal',
    }),

    // ---- Duplicate pair 3: similar name + same org ----
    mk({
      id: 'c_dupe3_a',
      firstName: 'Sofia',
      lastName: 'Russo',
      organization: 'Stripe',
      emails: [{ value: 'sofia@stripe.com', label: 'work', primary: true }],
    }),
    mk({
      id: 'c_dupe3_b',
      firstName: 'S',
      lastName: 'Russo',
      organization: 'Stripe',
      emails: [{ value: 's.russo@stripe.com', label: 'work', primary: true }],
    }),

    // ---- Misc additional contacts to round out 40 ----
    mk({
      id: 'c_michelle',
      firstName: 'Michelle',
      lastName: 'Rios',
      organization: 'Linear',
      title: 'Developer Advocate',
      emails: [{ value: 'michelle@linear.app', label: 'work', primary: true }],
      tags: ['community'],
    }),
    mk({
      id: 'c_dev',
      firstName: 'Devansh',
      lastName: 'Mehta',
      organization: 'Notion',
      title: 'Engineer',
      emails: [{ value: 'devansh@notion.so', label: 'work', primary: true }],
      tags: ['community'],
    }),
    mk({
      id: 'c_andre',
      firstName: 'André',
      lastName: 'Lavoie',
      organization: 'Figma',
      title: 'Designer',
      emails: [{ value: 'andre@figma.com', label: 'work', primary: true }],
      tags: ['design', 'community'],
    }),
    mk({
      id: 'c_helena',
      firstName: 'Helena',
      lastName: 'Greco',
      organization: 'Webflow',
      emails: [{ value: 'helena@webflow.com', label: 'work', primary: true }],
      tags: ['community'],
    }),
    mk({
      id: 'c_vivek',
      firstName: 'Vivek',
      lastName: 'Rao',
      organization: 'Vivek Studio',
      title: 'Solo Designer',
      emails: [{ value: 'vivek@viveks.studio', label: 'work', primary: true }],
      urls: [{ value: 'https://vivek.design', label: 'portfolio' }],
      tags: ['design', 'freelancer'],
    }),
    mk({
      id: 'c_tomi',
      firstName: 'Tomi',
      lastName: 'Akinwumi',
      emails: [{ value: 'tomi.a@gmail.com', label: 'personal', primary: true }],
      tags: ['friend'],
      groupIds: ['g_friends'],
    }),
    mk({
      id: 'c_ben',
      firstName: 'Ben',
      lastName: 'Owusu',
      organization: 'Bayview Medical',
      title: 'Physiotherapist',
      emails: [{ value: 'ben.owusu@bayview.health', label: 'work', primary: true }],
      tags: ['health'],
    }),
    mk({
      id: 'c_nina',
      firstName: 'Nina',
      lastName: 'Silva',
      organization: 'Acme Corp',
      title: 'Engineering Manager',
      emails: [{ value: 'nina@acme.com', label: 'work', primary: true }],
      tags: ['acme'],
    }),
    mk({
      id: 'c_olivia',
      firstName: 'Olivia',
      lastName: 'Tan',
      organization: 'Acme Corp',
      title: 'Engineer',
      emails: [{ value: 'olivia@acme.com', label: 'work', primary: true }],
      tags: ['acme'],
    }),
    mk({
      id: 'c_kai',
      firstName: 'Kai',
      lastName: 'Holloway',
      organization: 'Hold Inc',
      emails: [{ value: 'kai@holdinc.com', label: 'work', primary: true }],
      tags: ['investor'],
    }),
    mk({
      id: 'c_landlord',
      firstName: 'Susan',
      lastName: 'Vega',
      displayName: 'Landlord (Susan)',
      emails: [{ value: 'susan.vega@apartments.local', label: 'personal', primary: true }],
      tags: ['utility'],
    }),
    mk({
      id: 'c_plumber',
      firstName: 'Joe',
      lastName: 'Ramirez',
      displayName: 'Joe — plumber',
      phones: [{ value: '+1 415 555 0290', label: 'mobile', primary: true }],
      tags: ['utility'],
    }),
  ];

  // Add some linked relationships (Sam <-> Priya colleagues, etc.)
  const links = (id: string, others: { id: string; rel: string }[]) => {
    const c = contacts.find((x) => x.id === id);
    if (!c) return;
    c.linkedContactIds = others.map((o) => ({ id: o.id, relationship: o.rel }));
  };
  links('c_sam', [
    { id: 'c_priya', rel: 'Reports to' },
    { id: 'c_alex', rel: 'Manager' },
  ]);
  links('c_priya', [{ id: 'c_sam', rel: 'Manager' }]);
  links('c_emma', [{ id: 'c_alex', rel: 'Reports to' }]);
  links('c_sarah_acme', [{ id: 'c_nina', rel: 'Coworker at Acme' }]);

  const groups: Group[] = [
    {
      id: 'g_family',
      name: 'Family',
      emoji: '🏠',
      color: '#10b981',
      contactIds: ['c_mom', 'c_brother'],
    },
    {
      id: 'g_friends',
      name: 'Friends',
      emoji: '🍻',
      color: '#3b82f6',
      contactIds: ['c_riley', 'c_jordan', 'c_kim', 'c_tomi'],
    },
    {
      id: 'g_q2',
      name: 'Q2 launch team',
      emoji: '🚀',
      color: '#8b5cf6',
      contactIds: ['c_sam', 'c_priya', 'c_jules', 'c_emma'],
    },
    {
      id: 'g_acme',
      name: 'Acme',
      emoji: '🏢',
      color: '#f59e0b',
      contactIds: ['c_sarah_acme', 'c_acme_legal', 'c_nina', 'c_olivia'],
    },
  ];

  const smartViews: ContactSmartView[] = [
    {
      id: 'sv_top',
      name: 'Top correspondents',
      definition: 'Most-emailed contacts in the last 90 days',
      isAiCurated: true,
      precomputed: false,
      emoji: '✉️',
      contactIds: [],
    },
    {
      id: 'sv_collab',
      name: 'Frequent collaborators',
      definition: 'Most-shared docs / notes / drive in the last 90 days',
      isAiCurated: true,
      precomputed: false,
      emoji: '🤝',
      contactIds: [],
    },
    {
      id: 'sv_vip',
      name: 'VIPs',
      definition: 'High-strength relationships',
      isAiCurated: true,
      precomputed: false,
      emoji: '⭐',
      contactIds: [],
    },
    {
      id: 'sv_external',
      name: 'External',
      definition: 'Contacts outside your org',
      isAiCurated: true,
      precomputed: false,
      emoji: '🌐',
      contactIds: [],
    },
    {
      id: 'sv_stale',
      name: 'Going stale',
      definition: 'Active relationships that have gone quiet',
      isAiCurated: true,
      precomputed: false,
      emoji: '⏳',
      contactIds: [],
    },
    {
      id: 'sv_new',
      name: 'New connections',
      definition: 'Added in the last 30 days',
      isAiCurated: true,
      precomputed: false,
      emoji: '✨',
      contactIds: [],
    },
  ];

  return { contacts, groups, smartViews };
}

export const SEED_USER_DOMAIN = USER_DOMAIN;
