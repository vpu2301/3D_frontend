import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MaskedNumber } from "@/components/voice/MaskedNumber";
import { useSession } from "@/stores/session";

describe("MaskedNumber", () => {
  beforeEach(() => {
    useSession.getState().setLocale("de");
    useSession.getState().setRole("owner");
  });
  afterEach(() => {
    useSession.getState().setRole(null);
  });

  it("masks by default and reveals on hover for the owner", () => {
    render(<MaskedNumber value="+4917112344521" />);
    const el = screen.getByTestId("masked-number");
    expect(el).toHaveTextContent("+49 171 ••• 4521");
    fireEvent.mouseEnter(el);
    expect(el).toHaveTextContent("+49 171 1234 4521");
    fireEvent.mouseLeave(el);
    expect(el).toHaveTextContent("+49 171 ••• 4521");
  });

  it("never reveals for a role without the permission", () => {
    useSession.getState().setRole("staff");
    render(<MaskedNumber value="+4917112344521" copy />);
    const el = screen.getByTestId("masked-number");
    fireEvent.mouseEnter(el);
    expect(el).toHaveTextContent("+49 171 ••• 4521");
    expect(el).not.toHaveAttribute("role", "button");
  });

  it("copies the full number only for the owner", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const { unmount } = render(<MaskedNumber value="+4917112344521" copy />);
    fireEvent.click(screen.getByRole("button", { name: "Nummer kopieren" }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledWith("+49 171 1234 4521"));
    unmount();

    useSession.getState().setRole("staff");
    render(<MaskedNumber value="+4917112344521" copy />);
    fireEvent.click(screen.getByRole("button", { name: "Nummer kopieren" }));
    await vi.waitFor(() => expect(writeText).toHaveBeenLastCalledWith("+49 171 ••• 4521"));
  });

  it("renders a dash for a missing number", () => {
    render(<MaskedNumber value={null} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
