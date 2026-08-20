/**
 * A native `<select>` draws its open list through the OS, where no stylesheet
 * reaches it. This pins the property that fixes it: the options are ordinary
 * DOM in our document, wearing our classes.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PlatSelect from '@/pages/telephony/_components/shared/PlatSelect';

beforeAll(() => {
  // Radix drives pointer capture and scrolling; jsdom implements neither.
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.setPointerCapture = () => {};
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
});

function Harness({ onChange = vi.fn() }: { onChange?: (v: string) => void }) {
  return (
    <PlatSelect value="en" onChange={onChange} ariaLabel="Call language">
      <option value="">Auto — follow the callee</option>
      <option value="en">English</option>
      <option value="de">Deutsch</option>
    </PlatSelect>
  );
}

describe('PlatSelect', () => {
  it('is not a native select — the list is our own DOM', async () => {
    const user = userEvent.setup();
    const { container } = render(<Harness />);
    expect(container.querySelector('select')).toBeNull();

    await user.click(screen.getByLabelText('Call language'));

    const listbox = await screen.findByRole('listbox');
    expect(listbox.className).toContain('rounded-[12px]');
    expect(listbox.className).toContain('plat'); // tokens resolve in the portal
    expect(screen.getAllByRole('option').map((o) => o.textContent)).toEqual([
      'Auto — follow the callee',
      'English',
      'Deutsch',
    ]);
  });

  it('reports the chosen value, and keeps "" meaning "default"', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Harness onChange={onChange} />);

    await user.click(screen.getByLabelText('Call language'));
    await user.click(await screen.findByRole('option', { name: 'Auto — follow the callee' }));

    // Radix cannot carry "" as an item value; the sentinel must not leak out.
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('shows the selected option on the closed trigger', () => {
    render(<Harness />);
    expect(screen.getByLabelText('Call language').textContent).toContain('English');
  });

  it('renders optgroup labels as section headings', async () => {
    const user = userEvent.setup();
    render(
      <PlatSelect value="all" onChange={vi.fn()} ariaLabel="Filter by result" variant="pill">
        <option value="all">Any result</option>
        <optgroup label="Outcome">
          <option value="o:confirmed">confirmed</option>
        </optgroup>
        <optgroup label="Failure">
          <option value="f:no_answer">no answer</option>
        </optgroup>
      </PlatSelect>,
    );

    await user.click(screen.getByLabelText('Filter by result'));
    expect(await screen.findByText('Outcome')).toBeInTheDocument();
    expect(screen.getByText('Failure')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'confirmed' })).toBeInTheDocument();
  });
});
