const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')
const helper = require('./test_helper')
const Note = require('../models/blog')

const api = supertest(app)
beforeEach(async () => {
  await Note.deleteMany({})
  await Note.insertMany(helper.initialBlogs)
})

describe('BLOGS API TESTS', () => { 
    test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    const blogs = response.body
    assert.ok(blogs[0].id)
    })

    test('a valid blog can be added', async () => {
    const initialBlogs = await helper.blogsInDb()

    const newBlog = {
      title: "Test Title",
      author: "Test Author",
      url: "testurl.com",
      likes: 2
    }
    
    const response = await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        
    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, initialBlogs.length + 1)
    })

    test('likes default to 0', async () => {
      const newBlog = {
        title: "Test Title",
        author: "Test Author",
        url: "testurl.com"
      }

      const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/)

      assert.strictEqual(response.body.likes, 0)
    })


    test('blog missing title is not added', async () => {
      const newBlog = {
        author: "Test Author",
        url: "testurl.com"
      }

      await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
    })

    test('blog missing url is not added', async () => {
      const newBlog = {
        title: "Test Title",
        author: "Test Author"
      }

      await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
    })

    describe('deletion of a blog', () => {
      test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        
        await api
          .delete(`/api/blogs/${blogToDelete.id}`)
          .expect(204)
        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
      })
    })
    
    describe('updating a blog', () => {
      test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlogData = {
          title: "Updated Title",
          author: "Updated Author",
          url: "updatedurl.com",
          likes: 10
        }

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(updatedBlogData)
          .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
      })
      test('updated blog id is not present in the response', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const updatedBlogData = {
          title: "Updated Title",
          author: "Updated Author",
          url: "updatedurl.com",
          likes: 10
        }

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(updatedBlogData)
          .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
      })
    })
})

after(() => {
  mongoose.connection.close()
})
