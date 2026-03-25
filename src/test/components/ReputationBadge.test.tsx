import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReputationBadge } from "@/components/gamification/ReputationBadge";

describe("ReputationBadge", () => {
  it("renders Newcomer as a gray pill with visible text", () => {
    render(<ReputationBadge levelName="Newcomer" badgeColor="gray" />);
    const badge = screen.getByTestId("rep-badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent("Newcomer");
    expect(badge.className).toContain("bg-gray");
  });

  it("renders Legend with animate-shimmer class", () => {
    render(<ReputationBadge levelName="Legend" badgeColor="gold" />);
    const badge = screen.getByTestId("rep-badge");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("animate-shimmer");
  });

  it("renders compact when size=sm (has text-xs class)", () => {
    render(<ReputationBadge levelName="Regular" badgeColor="blue" size="sm" />);
    const badge = screen.getByTestId("rep-badge");
    expect(badge.className).toContain("text-xs");
    expect(badge.className).toContain("px-1.5");
  });

  it("returns null when levelName is empty", () => {
    const { container } = render(
      <ReputationBadge levelName="" badgeColor="gray" />
    );
    expect(container.firstChild).toBeNull();
  });
});
