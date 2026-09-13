/**
 * Every dashboard that can sit on the page. The board stores an array of these
 * ids, so adding a dashboard is a matter of registering it here — nothing in
 * the grid, the gallery or the stored layout needs to know what it renders.
 */
import type { ComponentType } from 'react';
import { Hash, Image as ImageIcon, MessageSquare, Phone, PhoneCall, Plug, Sparkles, type LucideIcon } from 'lucide-react';
import { CallsWidget, PhonesWidget, VoiceWidget } from './VoiceWidgets';
import { ImagesWidget, MessagesWidget } from './CommsWidgets';
import { IntegrationsWidget, SkillsWidget } from './SystemWidgets';

export interface WidgetDef {
  /** Stable — it is what gets persisted in the layout. */
  id: string;
  title: string;
  /** One line, shown in the gallery. */
  subtitle: string;
  icon: LucideIcon;
  /** Columns it takes on the two-column board. */
  span?: 1 | 2;
  Body: ComponentType;
}

export const WIDGETS: WidgetDef[] = [
  {
    id: 'voice',
    title: 'Voice',
    subtitle: 'The line: engine, live calls, today’s talking',
    icon: Phone,
    Body: VoiceWidget,
  },
  {
    id: 'calls',
    title: 'Calls',
    subtitle: 'Volume per day, direction, talk time and cost',
    icon: PhoneCall,
    Body: CallsWidget,
  },
  {
    id: 'phones',
    title: 'Phone numbers',
    subtitle: 'Who the agent speaks to, contacts and do-not-call',
    icon: Hash,
    Body: PhonesWidget,
  },
  {
    id: 'messages',
    title: 'Text',
    subtitle: 'Messages taken and chats answered',
    icon: MessageSquare,
    Body: MessagesWidget,
  },
  {
    id: 'images',
    title: 'Images',
    subtitle: 'Pictures the agent generated, by tool',
    icon: ImageIcon,
    Body: ImagesWidget,
  },
  {
    id: 'integrations',
    title: 'Integrations',
    subtitle: 'What the agent is plugged into',
    icon: Plug,
    Body: IntegrationsWidget,
  },
  {
    id: 'skills',
    title: 'Skills',
    subtitle: 'Playbooks the agent can run',
    icon: Sparkles,
    Body: SkillsWidget,
  },
];

export const WIDGET_BY_ID = new Map(WIDGETS.map((w) => [w.id, w]));

/** Voice is on the board out of the box; the rest are one drag away. */
export const DEFAULT_LAYOUT = ['voice'];
