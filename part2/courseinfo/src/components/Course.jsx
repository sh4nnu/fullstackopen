
const Header = (props) => {
  // console.log(props)
  return <h2>{props.course.name}</h2>
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>
  )
}

const Content = (props) => {
  const { parts } = props
  return (
    <div>
      {parts.map(part =>
        <Part key={part.id} part={part} />
      )}
    </div>
  )
}

const Total = (props) => {
  // let total = 0
  // props.parts.forEach(part => {
  //   total += part.exercises
  // })
  const total = props.parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p><b>Total of {total} exercises.</b></p>
}


const Course = (props) => {
  const { course } = props
  return (
    <>
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>
  )
}

export default Course