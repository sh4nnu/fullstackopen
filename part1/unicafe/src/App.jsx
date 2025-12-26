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
const StatisticLine = (props) => {
  return (
    <tr><td>{props.text}</td><td>{props.value}</td></tr>
  )
}
const Statistics = (props) => {
  if(props.good === 0 && props.neutral === 0 && props.bad === 0){
    return (
      <>
        <Header text="statistics" />
        <p>No feedback given</p>
      </>
    )
  }
  return (
    <>
      <Header text="statistics" />
      <table>
          <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={props.good + props.neutral + props.bad} />
          <StatisticLine text="average" value={(props.good - props.bad) / (props.good + props.neutral + props.bad)} />
          <StatisticLine text="positive" value={`${(props.good / (props.good + props.neutral + props.bad) * 100)} %`} />
        </tbody>
      </table>
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