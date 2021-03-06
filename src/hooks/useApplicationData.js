import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    //not implemented
    appointments: [],
    interviewers: []
  });

  const setDay = (day) => setState(prev => ({ ...prev, day }));

  function bookInterview(id, interview) {
    // console.log(id, interview);
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.put(`/api/appointments/${appointment.id}`, { interview })
      .then((res) => {
        setState(prev => ({...prev, appointments}))

        return axios.get("/api/days")
        // const spots = state.days.filter(curr => curr.name === state.day)[0].spots - 1


        // const days = state.days.map(current => {
        //   if (current.name === state.day) {
        //     return { ...current, spots }
        //   }
        //   return { ...current }
        // })

        // setState((prev) => ({
        //   ...prev,
        //   days
        // }))
      })
      .then((days) => {
        return setState(prev => ({...prev, days: days.data}))
      })

  }

  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`)
      .then((res) => {
        const spots = state.days.filter(curr => curr.name === state.day)[0].spots + 1

        const days = state.days.map(current => {
          if (current.name === state.day) {
            return { ...current, spots }
          }
          return { ...current }
        })

        setState((prev) => ({
          ...prev,
          appointments,
          days
        }))
      })
  }

  useEffect(() => {
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then((all) => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      }))
    })
  }, [])

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }
}