import { useState } from 'react'


const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleBlog = async (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url,
    })
  }

  return (
    <>
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
    </>
  )
}
export default BlogForm