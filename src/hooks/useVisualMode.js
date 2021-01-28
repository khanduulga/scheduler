import { useState } from 'react'

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);


  const transition = (newMode, replace = false) => {

    replace ?
      setHistory(prev => {
        prev.pop()
        prev.push(newMode)
        return prev
      }) :
      setHistory([...history, newMode]);

    setMode(newMode)
  }
  const back = () => {

    if (history.length <= 1) {
      return;
    }

    setHistory(prev => {
      prev.pop();
      return prev;
    })

    const lastMode = history[history.length - 2]

    setMode(lastMode)
  }

  return {
    mode,
    transition,
    back
  }
}

