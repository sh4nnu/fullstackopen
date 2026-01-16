import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notifyMessage, setNotifyMessage] = useState(null)
  const [notifyColor, setNotifyColor] = useState(null)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON && loggedUserJSON !='null') {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])



  const showNotification = (message, color) => {
    setNotifyMessage(message)
    setNotifyColor(color)
    setTimeout(() => {
      setNotifyMessage(null)
      setNotifyColor(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const loggedInUser = await loginService.login({
        username,
        password,
      })
      setUser(loggedInUser)
      blogService.setToken(loggedInUser.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedInUser))
      setUsername('')
      setPassword('')
      showNotification('login successful', 'green')
    } catch (error) {
      showNotification('wrong username or password', 'red')
      setPassword('')
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const handleBlog = async (event) =>{
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        title,
        author,
        url,
      })
      setBlogs(blogs.concat(newBlog))
      setTitle('')
      setAuthor('')
      setUrl('')
      showNotification(`a new blog  ${newBlog.title}! by ${newBlog.author} added`, 'green')
    } catch (error) {
      showNotification(`failed to create blog: ${error}`, 'red')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notifyMessage} color={notifyColor} />
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      <Notification message={notifyMessage} color={notifyColor} />
      <h2>blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>

      <div>
        <form onSubmit={handleBlog}>
          <h2>create new</h2>
          title: 
          <input type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
        <br></br>
        author: 
          <input type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
        <br></br>
        url: 
          <input type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
        <br></br>
        <button type="submit">create</button>
        </form>
      </div>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App
