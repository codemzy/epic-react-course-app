// 🐨 here are the things you're going to need for this test:
import React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import {queryCache} from 'react-query'
import {buildUser, buildBook} from 'test/generate'
import * as auth from 'auth-provider'
import {AppProviders} from 'context'
import {App} from 'app'

// 🐨 after each test, clear the queryCache and auth.logout
afterEach(async() => {
    queryCache.clear();
    await auth.logout();
});

// for checking any fect requests that need to be mocked
window.fetch = async (url, config) => {
  console.warn(url, config)
  return Promise.reject(new Error(`NEED TO HANDLE: ${url}`))
};

test('renders all the book information', async() => {
    // 🐨 "authenticate" the client by setting the auth.localStorageKey in localStorage to some string value (can be anything for now)
    window.localStorage.setItem(auth.localStorageKey, 'SOME_FAKE_TOKEN');
    // 🐨 create a user using `buildUser`
    const user = buildUser();
    // 🐨 create a book use `buildBook`
    const book = buildBook();
    // 🐨 update the URL to `/book/${book.id}`
    //   💰 window.history.pushState({}, 'page title', route)
    //   📜 https://developer.mozilla.org/en-US/docs/Web/API/History/pushState
    window.history.pushState({}, 'Test page', `/book/${book.id}`);

    // 🐨 reassign window.fetch to another function and handle the following requests:
    // - url ends with `/me`: respond with {user}
    // - url ends with `/list-items`: respond with {listItems: []}
    // - url ends with `/books/${book.id}`: respond with {book}
    // 💰 window.fetch = async (url, config) => { /* handle stuff here*/ }
    // 💰 return Promise.resolve({ok: true, json: async () => ({ /* response data here */ })})
    let originalFetch = window.fetch;
    // mocking fetch requests
    window.fetch = async function(url, config) {
        if (url.endsWith('/bootstrap')) { // from video
            return Promise.resolve({ok: true, json: async () => ({ user, listItems: [] })});
        } else if (url.endsWith(`/list-items`)) {
            return Promise.resolve({ok: true, json: async () => ({ listItems: []})});
        } else if (url.endsWith(`/books/${book.id}`)) {
            return Promise.resolve({ok: true, json: async () => ({ book })});
        }
        return originalFetch(url, config); // default if not any of above
    }

    // 🐨 render the App component and set the wrapper to the AppProviders
    // (that way, all the same providers we have in the app will be available in our tests)
    render(<App />, {wrapper: AppProviders});

    // 🐨 use waitFor to wait for the queryCache to stop fetching and the loading
    // indicators to go away
    // 📜 https://testing-library.com/docs/dom-testing-library/api-async#waitfor
    // 💰 if (queryCache.isFetching or there are loading indicators) then throw an error...
    await waitForElementToBeRemoved(() => screen.getByLabelText('loading'));
    // screen.debug();
    // 🐨 assert the book's info is in the document
    // console.log(book);
    // check book contents is there
    expect(screen.getByRole('heading', {name: book.title})).toBeInTheDocument();
    expect(screen.getByText(book.author)).toBeInTheDocument();
    expect(screen.getByText(book.publisher)).toBeInTheDocument();
    expect(screen.getByText(book.synopsis)).toBeInTheDocument();
    expect(screen.getByRole('img', {name: /book cover/i})).toHaveAttribute('src', book.coverImageUrl);
    // check button are there
    expect(screen.getByRole('button', {name: /add to list/i})).toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /remove from list/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /mark as read/i})).not.toBeInTheDocument();
    expect(screen.queryByRole('button', {name: /mark as unread/i})).not.toBeInTheDocument();
});