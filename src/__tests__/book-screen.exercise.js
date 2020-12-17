import React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import * as auth from 'auth-provider'
import * as usersDB from 'test/data/users' // extra 1
import * as booksDB from 'test/data/books' // extra 1
import * as listItemsDB from 'test/data/list-items' // extra 1 from vid
import {buildUser, buildBook} from 'test/generate'
import {AppProviders} from 'context'
import {App} from 'app'

// general cleanup
afterEach(async () => {
    queryCache.clear()
    await usersDB.reset()
    await booksDB.reset()
    await listItemsDB.reset()
    await auth.logout()
})

test('renders all the book information', async () => {
    const user = buildUser()
    await usersDB.create(user)
    const authUser = await usersDB.authenticate(user)
    // this is what our auth provider does to persist the user's
    // logged in state so it can give us a token without making a request
    // every provider will be different and you'll need to adjust this
    // to whatever they do (you may even have to mock more of their functions).
    window.localStorage.setItem(auth.localStorageKey, authUser.token)

  const book = buildBook()
  await booksDB.create(book)
  const route = `/book/${book.id}`
  window.history.pushState({}, 'Test page', route)

  render(<App />, {wrapper: AppProviders})

  await waitForElementToBeRemoved(() => [
    ...screen.queryAllByLabelText(/loading/i),
    ...screen.queryAllByText(/loading/i), // wait for all loading elements to be removed before we continue
  ])

  expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument()
  expect(screen.getByText(book.author)).toBeInTheDocument()
  expect(screen.getByText(book.publisher)).toBeInTheDocument()
  expect(screen.getByText(book.synopsis)).toBeInTheDocument()
  expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute(
    'src',
    book.coverImageUrl,
  )
  expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()

  expect(
    screen.queryByRole('button', {name: /remove from list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as read/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('textbox', {name: /notes/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
  expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
})
