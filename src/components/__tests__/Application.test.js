import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  waitForElementToBeRemoved,
  queryByText,
  getByDisplayValue
} from "@testing-library/react";

import { fireEvent } from "@testing-library/react/dist";


import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday")).then(() => {
      fireEvent.click(getByText("Tuesday"))
      expect(getByText("Leopold Silvers")).toBeInTheDocument()
    })
  })

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[0]

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    // debug();
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving..."))

    expect(queryByText(appointment, "Saving...")).not.toBeInTheDocument();

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument()
  })

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[1]

    // 3. Click the "Delete" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that the confirmation message is shown.
    expect(getByText(appointment, "Are you sure you would like to delete?")).toBeInTheDocument();

    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, "Deleting...")).toBeInTheDocument();

    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting..."))
    expect(queryByText(appointment, "Deleting...")).not.toBeInTheDocument();

    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument()
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointments = getAllByTestId(container, "appointment")
    const appointment = appointments[1]

    // 3. Click the "Edit" button on the booked appointment.
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. Check that the edit form is shown with "Archie Cohen".
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
    expect(getByText(appointment, "Tori Malcolm")).toBeInTheDocument();

    // 5. Change the interviewer on the edit page.
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. Click the "Save" button on the same appointment
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check and wait until that the element with "saving" is displayed and removed
    expect(getByText(appointment, "Saving...")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving..."))

    expect(queryByText(appointment, "Saving...")).not.toBeInTheDocument();

    // 8. Wait until the element with the text "Archie Cohen" is displayed.
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();

    // 9. Check that the DayListItem with the text "Monday" stays the same
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    // console.log(prettyDOM(appointments))
    console.log(prettyDOM(day))

    expect(queryByText(day, "1 spot remaining")).toBeInTheDocument()
  });

})