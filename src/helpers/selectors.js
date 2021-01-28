const getAppointmentsForDay = (state, day) => {
  const appointmentsForDay = state.days.filter(i => i.name === day)[0]? state.days.filter(i => i.name === day)[0].appointments : [];
  const filteredAppointments = appointmentsForDay.map(appointment => state.appointments[appointment]);
  return filteredAppointments;
};

const getInterview = (state, interview) => {
  return interview? {
    student: interview.student,
    interviewer: state.interviewers[interview.interviewer]
  } : null
};

const getInterviewersForDay = (state, day) => {
  const interviewersForDay = state.days.filter(i => i.name === day)[0]? state.days.filter(i => i.name === day)[0].interviewers : [];
  const filteredInterviewers = interviewersForDay.map(interviewer => state.interviewers[interviewer]);
  return filteredInterviewers;
};



export { getAppointmentsForDay, getInterview, getInterviewersForDay };