const Notification = ({ message, color }) => {
  const notifystyle = {
    color: color ? color : 'black',
    background: 'lightgrey',
    fontSize: '20px',
    borderStyle: 'solid',
    borderRadius: '5px',
    padding: 10,
    marginBottom: 10,
  }
    if (message === null) {
      return null
    }

    return (
      <div className="error" style={notifystyle}>
        {message}
      </div>
    )
  }

export default Notification