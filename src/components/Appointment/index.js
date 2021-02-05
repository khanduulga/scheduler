import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header"
import Empty from "components/Appointment/Empty"
import Show from "components/Appointment/Show"
import Form from "components/Appointment/Form"
import Status from "components/Appointment/Status"
import Confirm from "components/Appointment/Confirm"
import Error from "components/Appointment/Error"





import useVisualMode from "hooks/useVisualMode"

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING"
const CONFIRM = "CONFIRM"
const EDIT = "EDIT"
const ERROR_SAVE = "ERROR_SAVE"
const ERROR_DELETE = "ERROR_DELETE"



export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      id: props.id,
      student: name,
      interviewer
    };

    //NEED TO APPEND TO PROMISE SUPPOSEDLY COMING FROM BOOKINTERVIEW
    transition(SAVING)
    //doesnt return a promise
    props.bookInterview(props.id, interview)
      .then(res => {
        transition(SHOW);
      })
      .catch(err => {
        transition(ERROR_SAVE, true)
      })
  }

  function cancel() {
    transition(DELETING, true)

    props
      .cancelInterview(props.id)
      .then(res => {
        transition(EMPTY)
      })
      .catch(err => {
        transition(ERROR_DELETE, true)
      })
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && <Form
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />}
      {mode === SAVING && <Status message="Saving..." />}
      {mode === DELETING && <Status message="Deleting..." />}
      {mode === CONFIRM && <Confirm
        message="Are you sure you would like to delete?"
        onConfirm={cancel}
        onCancel={back}
      />}
      {mode === EDIT && <Form
        name={props.interview.student}
        interviewer={props.interview.interviewer.id}
        interviewers={props.interviewers}
        onCancel={back}
        onSave={save}
      />}
      {mode === ERROR_SAVE && <Error
        message="Issue saving the appointment!"
        onClose={back}
      />}
      {mode === ERROR_DELETE && <Error
        message="Issue deleting the appointment!"
        onClose={back}
      />}
    </article>
  );
}

