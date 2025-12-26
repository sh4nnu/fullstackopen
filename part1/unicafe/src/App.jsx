import { useState } from 'react'

const Header =({text}) => <h1>{text}</h1>

const Button = ({onClick, text}) => (
  <button onClick={onClick}>
    {text}
  </button>
)

const Feedback =(props) =>{
  return (
    <>
    <Header text={props.header_text} />
    <Button onClick={props.onClick_good} text="good" />
    <Button onClick={props.onClick_neutral} text="neutral" />
    <Button onClick={props.onClick_bad} text="bad" />
    </>
  )
}
const Statistics = (props) => {
  return (
    <>
      <Header text="statistics" />
      <p>good {props.good}</p>
      <p>neutral {props.neutral}</p>
      <p>bad {props.bad}</p>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <Feedback
        header_text="give feedback"
        onClick_good={() => setGood(good + 1)}
        onClick_neutral={() => setNeutral(neutral + 1)}
        onClick_bad={() => setBad(bad + 1)}
      />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  )
}

export default App