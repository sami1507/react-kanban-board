import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { App } from "../App";
import { STORAGE_KEY } from "../state/storage";

function column(name: RegExp) {
  return screen.getByRole("region", { name });
}

describe("Board", () => {
  it("renders the four stages with the seeded tasks", () => {
    render(<App />);

    expect(within(column(/backlog/i)).getByText("Write onboarding checklist")).toBeInTheDocument();
    expect(within(column(/in progress/i)).getByText("Set up staging database")).toBeInTheDocument();
    expect(within(column(/review/i)).getByText("Fix flaky checkout test")).toBeInTheDocument();
    expect(within(column(/done/i)).getByText("Review pricing page copy")).toBeInTheDocument();
  });

  it("adds a task from the form and saves it to localStorage", async () => {
    const user = userEvent.setup();
    render(<App />);

    const backlog = column(/backlog/i);
    await user.click(within(backlog).getByRole("button", { name: "+ Add" }));
    await user.type(screen.getByLabelText("Title"), "Draft release notes");
    await user.click(screen.getByRole("button", { name: "Add task" }));

    expect(within(backlog).getByText("Draft release notes")).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toContain("Draft release notes");
  });

  it("keeps the add button disabled until a title is entered", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(within(column(/review/i)).getByRole("button", { name: "+ Add" }));
    expect(screen.getByRole("button", { name: "Add task" })).toBeDisabled();

    await user.type(screen.getByLabelText("Title"), "   ");
    expect(screen.getByRole("button", { name: "Add task" })).toBeDisabled();
  });

  it("moves a card to the next stage with its keyboard-accessible button", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole("button", { name: 'Move "Write onboarding checklist" to In progress' }),
    );

    expect(within(column(/in progress/i)).getByText("Write onboarding checklist")).toBeInTheDocument();
    expect(within(column(/backlog/i)).queryByText("Write onboarding checklist")).not.toBeInTheDocument();
  });

  it("deletes a card", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Delete Review pricing page copy" }));

    expect(screen.queryByText("Review pricing page copy")).not.toBeInTheDocument();
  });

  it("restores the saved board on the next visit", async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await user.click(screen.getByRole("button", { name: "Delete Review pricing page copy" }));
    first.unmount();

    render(<App />);
    expect(screen.queryByText("Review pricing page copy")).not.toBeInTheDocument();
  });
});
