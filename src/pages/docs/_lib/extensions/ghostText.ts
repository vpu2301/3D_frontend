import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';

interface GhostState {
  text: string;
  pos: number;
}

const pluginKey = new PluginKey<GhostState | null>('ghostText');

export const GhostText = Extension.create({
  name: 'ghostText',
  addProseMirrorPlugins() {
    return [
      new Plugin<GhostState | null>({
        key: pluginKey,
        state: {
          init: () => null,
          apply(tr, value) {
            const meta = tr.getMeta(pluginKey);
            if (meta !== undefined) return meta as GhostState | null;
            if (value && tr.docChanged) {
              // invalidate ghost on any doc change
              return null;
            }
            return value;
          },
        },
        props: {
          decorations(state) {
            const v = pluginKey.getState(state);
            if (!v) return DecorationSet.empty;
            const widget = document.createElement('span');
            widget.textContent = v.text;
            widget.className = 'ai-docs-ghost-text';
            widget.setAttribute('contenteditable', 'false');
            return DecorationSet.create(state.doc, [
              Decoration.widget(v.pos, widget, { side: 1 }),
            ]);
          },
        },
      }),
    ];
  },
});

export function setGhostText(editor: any, text: string | null) {
  const pos = editor.state.selection.from;
  const tr = editor.state.tr.setMeta(pluginKey, text ? { text, pos } : null);
  editor.view.dispatch(tr);
}

export function getGhostText(editor: any): GhostState | null {
  return pluginKey.getState(editor.state);
}
