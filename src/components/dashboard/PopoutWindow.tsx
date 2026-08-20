/**
 * Renders its children into a NEW TAB of the browser the app is already in.
 *
 * A detail view is sometimes too big for a modal — you want it full-size,
 * beside the dashboard rather than on top of it. `window.open` with a target
 * but no window features is the difference between a tab and a detached popup
 * window: the moment you pass `popup=yes` or a width/height, browsers spawn a
 * separate window instead, which is not what people expect from "open this".
 *
 * The new tab starts as a blank document; we clone the app's stylesheets into
 * it, mount a div, and portal the same React subtree there. Because it stays
 * one React tree, every context (router, query client, i18n) keeps working —
 * nothing is re-fetched or re-initialised, the nodes simply paint in the tab.
 */
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

/** Snapshot every stylesheet of the host document into the popout. */
function cloneStyleNode(node: Node, dest: Document) {
  dest.head.appendChild(node.cloneNode(true));
}

function isStyleNode(node: Node): boolean {
  if (!(node instanceof Element)) return false;
  return (
    node.tagName === 'STYLE' ||
    (node.tagName === 'LINK' && node.getAttribute('rel') === 'stylesheet')
  );
}

export function PopoutWindow({
  title,
  onClose,
  children,
}: {
  title: string;
  /** Called when the tab closes — by the user, or because it never opened. */
  onClose: () => void;
  children: ReactNode;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  // Kept in a ref so a changing callback never re-runs the effect: re-running
  // would open a second window.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    // No feature string: that is what makes this a tab rather than a window.
    const w = window.open('', '_blank');

    // Blocked by a popup blocker — fall straight back to the modal.
    if (!w) {
      onCloseRef.current();
      return;
    }

    const doc = w.document;
    doc.title = title;

    const viewport = doc.createElement('meta');
    viewport.name = 'viewport';
    viewport.content = 'width=device-width, initial-scale=1';
    doc.head.appendChild(viewport);

    // Fonts and preconnects live in index.html; stylesheets are <link> in a
    // build and injected <style> in dev — cloning the whole head covers both.
    document.head.querySelectorAll('style, link').forEach((node) => cloneStyleNode(node, doc));

    // Vite injects updated CSS as new <style> tags on hot reload; mirror them
    // so the popout does not drift from the parent while developing.
    const observer = new MutationObserver((records) => {
      records.forEach((r) =>
        r.addedNodes.forEach((n) => {
          if (isStyleNode(n)) cloneStyleNode(n, doc);
        }),
      );
    });
    observer.observe(document.head, { childList: true });

    doc.documentElement.className = document.documentElement.className;
    doc.body.className = document.body.className;
    doc.body.style.margin = '0';

    const mount = doc.createElement('div');
    mount.className = 'plat plat-popout';
    doc.body.appendChild(mount);
    setContainer(mount);

    const handleClosed = () => onCloseRef.current();
    w.addEventListener('pagehide', handleClosed);
    // pagehide does not fire in every browser when a tab is closed from its
    // own tab strip, so watch `closed` as well.
    const poll = window.setInterval(() => {
      if (w.closed) {
        window.clearInterval(poll);
        handleClosed();
      }
    }, 400);

    // An orphaned tab would keep painting a dead React tree.
    const closeChild = () => w.close();
    window.addEventListener('beforeunload', closeChild);

    return () => {
      observer.disconnect();
      window.clearInterval(poll);
      window.removeEventListener('beforeunload', closeChild);
      w.removeEventListener('pagehide', handleClosed);
      w.close();
    };
    // Opened once per mount; the caller unmounts this component to close it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (container) container.ownerDocument.title = title;
  }, [container, title]);

  return container ? createPortal(children, container) : null;
}
