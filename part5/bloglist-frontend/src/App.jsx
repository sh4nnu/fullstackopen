import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  
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

  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(newBlog))

      showNotification(`a new blog  ${newBlog.title}! by ${newBlog.author} added`, 'green')
    } catch (error) {
      showNotification(`failed to create blog: ${error}`, 'red')
    }
  }

  const handleLike = async (blog) => {
    const updatedBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
      user: blog.user?.id || blog.user,
    }

    try {
      const savedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(blogs.map(item => (item.id === blog.id ? savedBlog : item)))
    } catch (error) {
      showNotification(`failed to like blog: ${error}`, 'red')
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
      <Togglable buttonLabel="create new blog">
        <BlogForm createBlog={addBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} onLike={handleLike} />
      )}
    </div>
  )
}
// TODO: 5.7
export default App
