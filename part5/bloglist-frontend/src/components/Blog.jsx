import { useState } from 'react'

const Blog = ({ blog, onLike }) => {
  const [showDetails, setShowDetails] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button type="button" onClick={toggleDetails}>
          {showDetails ? 'hide' : 'view'}
        </button>
      </div>
      {showDetails && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{' '}
            <button type="button" onClick={() => onLike(blog)}>
              like
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog
