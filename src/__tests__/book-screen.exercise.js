import React from 'react'
import {
  render,
  screen,
  waitForLoadingToFinish,
  loginAsUser,
  userEvent,
} from 'test/app-test-utils'
import {buildBook, buildListItem} from 'test/generate'
import * as booksDB from 'test/data/books'
import * as listItemsDB from 'test/data/list-items'
import {formatDate} from 'utils/misc'
import {App} from 'app'

test('renders all the book information', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

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

test('can create a list item for the book', async () => {
  const book = await booksDB.create(buildBook())
  const route = `/book/${book.id}`

  await render(<App />, {route})

  const addToListButton = screen.getByRole('button', {name: /add to list/i})
  userEvent.click(addToListButton)
  expect(addToListButton).toBeDisabled()

  await waitForLoadingToFinish()

  expect(
    screen.getByRole('button', {name: /mark as read/i}),
  ).toBeInTheDocument()
  expect(
    screen.getByRole('button', {name: /remove from list/i}),
  ).toBeInTheDocument()
  expect(screen.getByRole('textbox', {name: /notes/i})).toBeInTheDocument()

  const startDateNode = screen.getByLabelText(/start date/i)
  expect(startDateNode).toHaveTextContent(formatDate(Date.now()))

  expect(
    screen.queryByRole('button', {name: /add to list/i}),
  ).not.toBeInTheDocument()
  expect(
    screen.queryByRole('button', {name: /mark as unread/i}),
  ).not.toBeInTheDocument()
  expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
})

// extra 5
test('can remove a list item for the book', async () => {
    const user = await loginAsUser()
    const book = await booksDB.create(buildBook())
    await listItemsDB.create(buildListItem({owner: user, book}));
    const route = `/book/${book.id}`
    await render(<App />, {route, user})
    const removeFromListButton = screen.getByRole('button', {name: /remove from list/i})
    userEvent.click(removeFromListButton)
    expect(removeFromListButton).toBeDisabled()

    await waitForLoadingToFinish()

    // screen.debug();

    expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument()

    expect(screen.queryByRole('button', {name: /remove from list/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /mark as read/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /mark as unread/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('textbox', {name: /notes/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('radio', {name: /star/i})).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/start date/i)).not.toBeInTheDocument()
});

// extra 5
test('can mark a list item as read', async () => {
    const user = await loginAsUser()
    const book = await booksDB.create(buildBook())
    let listItem = await listItemsDB.create(buildListItem({owner: user, book, finishDate: null}));
    const route = `/book/${book.id}`
    await render(<App />, {route, user})
    
    const markAsReadButton = screen.getByRole('button', {name: /mark as read/i})
    userEvent.click(markAsReadButton)
    expect(markAsReadButton).toBeDisabled()
    await waitForLoadingToFinish()

    expect(screen.queryByRole('button', {name: /mark as read/i})).not.toBeInTheDocument()
    expect(screen.queryByRole('button', {name: /mark as unread/i})).toBeInTheDocument()
    expect(screen.queryAllByRole('radio', {name: /star/i})).toHaveLength(5)
    expect(screen.queryByRole('button', {name: /remove from list/i})).toBeInTheDocument()
    const startAndFinishDateNode = screen.getByLabelText(/start and finish date/i)
    expect(startAndFinishDateNode).toHaveTextContent(
        `${formatDate(listItem.startDate)} — ${formatDate(Date.now())}`,
    )
});