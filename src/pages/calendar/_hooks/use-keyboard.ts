import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addMinutes } from 'date-fns';
import { calendarStore } from './use-calendar-store';

interface Opts {
  onCreate: () => void;
  onOpenDetail: (id: string) => void;
  onPaletteOpen: () => void;
}

export function useCalendarKeyboard({ onCreate, onOpenDetail, onPaletteOpen }: Opts) {
  const navigate = useNavigate();
  useEffect(() => {
    function isTyping(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target.isContentEditable
      );
    }

    function handler(e: KeyboardEvent) {
      // Cmd/Ctrl+K is reserved for palette and allowed anywhere
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onPaletteOpen();
        return;
      }
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      switch (e.key) {
        case 't':
        case 'T':
          e.preventDefault();
          calendarStore.setAnchor(new Date().toISOString());
          break;
        case 'c':
        case 'C':
          e.preventDefault();
          onCreate();
          break;
        case '1': navigate('/calendar/day'); break;
        case '2': navigate('/calendar/3day'); break;
        case '3': navigate('/calendar/week'); break;
        case '4': navigate('/calendar/month'); break;
        case '5': navigate('/calendar/agenda'); break;
        case 'e':
        case 'E': {
          const id = calendarStore.getState().selectedEventId;
          if (id) onOpenDetail(id);
          break;
        }
        case 'Delete':
        case 'Backspace': {
          const id = calendarStore.getState().selectedEventId;
          if (id) {
            e.preventDefault();
            calendarStore.deleteEvent(id);
          }
          break;
        }
        case 'ArrowLeft':
        case 'ArrowRight': {
          const st = calendarStore.getState();
          const dir = e.key === 'ArrowLeft' ? -1 : 1;
          const anchor = new Date(st.anchorISO);
          if (st.view === 'week') anchor.setDate(anchor.getDate() + dir * 7);
          else if (st.view === '3day') anchor.setDate(anchor.getDate() + dir * 3);
          else if (st.view === 'month') anchor.setMonth(anchor.getMonth() + dir);
          else anchor.setDate(anchor.getDate() + dir);
          calendarStore.setAnchor(anchor.toISOString());
          break;
        }
        default:
          // Selected event navigation: arrow up/down shifts by 15 min
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            const id = calendarStore.getState().selectedEventId;
            if (!id) return;
            const ev = calendarStore.getState().events.find(x => x.id === id);
            if (!ev) return;
            const delta = e.key === 'ArrowUp' ? -15 : 15;
            calendarStore.moveEvent(
              id,
              addMinutes(new Date(ev.start), delta).toISOString(),
              addMinutes(new Date(ev.end), delta).toISOString(),
              { summary: `Nudged "${ev.title}" ${delta > 0 ? '+' : ''}${delta}m` },
            );
          }
          break;
      }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onCreate, onOpenDetail, onPaletteOpen, navigate]);
}
