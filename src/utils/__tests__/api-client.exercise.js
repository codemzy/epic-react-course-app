// 🐨 you'll need the test server
// 💰 the way that our tests are set up, you'll find this in `src/test/server/test-server.js`
import {server, rest} from 'test/server';
// 🐨 grab the client
import {client} from '../api-client';

// extra 1 - mock these modules
import {queryCache} from 'react-query';
import * as auth from 'auth-provider'
jest.mock('react-query');
jest.mock('auth-provider');

// the url
const apiURL = process.env.REACT_APP_API_URL;

// 🐨 add a beforeAll to start the server with `server.listen()`
// 🐨 add an afterAll to stop the server when `server.close()`
// 🐨 afterEach test, reset the server handlers to their original handlers
// via `server.resetHandlers()`

// start the server before tests start
beforeAll(() => {
  return server.listen();
});

// close the server when tests have finished
afterAll(() => {
  return server.close();
});

// after each test reset the handlers
afterEach(() => {
  return server.resetHandlers();
});

// 🐨 flesh these out:

test('calls fetch at the endpoint with the arguments for GET requests', async() => {
    // 🐨 add a server handler to handle a test request you'll be making
    // 💰 because this is the first one, I'll give you the code for how to do that.
    const endpoint = 'test-endpoint'
    const mockResult = {mockValue: 'VALUE'}
    // listen for a get request
    server.use(
        rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
            return res(ctx.json(mockResult))
        }),
    )
    //
    // 🐨 call the client (don't forget that it's asynchronous)
    // 🐨 assert that the resolved value from the client call is correct
    let result = await client(endpoint); // make the get request
    // check the result for our test
    expect(result).toEqual(mockResult)
});

test('adds auth token when a token is in localStorage', async() => {
    // 🐨 set the localStorage value to anything you want
    const token = 'FAKE_TOKEN'
    // 🐨 create a "request" variable with let
    let request;
    // 🐨 create a server handler to handle a test request you'll be making
    // 🐨 inside the server handler, assign "request" to "req" so we can use that
    //     to assert things later.
    //     💰 so, something like...
    //       async (req, res, ctx) => {
    //         request = req
    //         ... etc...
    //
    const endpoint = 'test-endpoint';
    server.use(
        rest.get(`${apiURL}/${endpoint}`, async(req, res, ctx) => {
            request = req;
            return res(ctx.json({ success: "success" }));
        }),
    )
    // 🐨 call the client (it's async)
    await client(endpoint, {token}); // pass the token
    // 🐨 verify that `request.headers.get('Authorization')` is correct (it should include the token)
    expect(request.headers.get('Authorization')).toBe('Bearer FAKE_TOKEN');
});

test('allows for config overrides', async() => {
    // 🐨 do a very similar setup to the previous test
    // 🐨 create a custom config that specifies properties like "mode" of "cors" and a custom header
    // 🐨 call the client with the endpoint and the custom config
    // 🐨 verify the request had the correct properties
    let request;
    const custom = { method: 'PUT', headers: {'Content-Type': 'fake-type'} };
    const endpoint = 'test-endpoint';
    // listen for put requests and intercept
    server.use(
        rest.put(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
            request = req;
            return res(ctx.json({ success: "success" }));
        }),
    );
    await client(endpoint, custom) // make the put request
    // test the request
    expect(request.headers.get('Content-Type')).toBe('fake-type');
    expect(request.method).toBe('PUT');
});

test('when data is provided, it is stringified and the method defaults to POST', async() => {
// 🐨 create a mock data object
// 🐨 create a server handler very similar to the previous ones to handle the post request
//    💰 Use rest.post instead of rest.get like we've been doing so far
// 🐨 call client with an endpoint and an object with the data
//    💰 client(endpoint, {data})
// 🐨 verify the request.body is equal to the mock data object you passed
    const data = { value: 'test', info: 'fake' };
    const endpoint = 'test-endpoint';
    // mock server listen for post requests
    server.use(
        rest.post(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
            return res(ctx.json(req.body)); // return the req.body
        }),
    );
    let result = await client(endpoint, { data }); // make the post request
    expect(result).toEqual(data); // check the body contains the data
});

// extra 1
test('when the request fails, an error message is recieved', async() => {
    const endpoint = 'test-endpoint';
    const testError = {message: 'Test error'}
    server.use(
        rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
            return res(ctx.status(400), ctx.json(testError));
        })
    );
    let result = await client(endpoint).catch(function(error) {
        return error;
    }); // make the post request
    expect(result).toEqual(testError);
});

// extra 1
test('logs out when 401 error is recieved', async() => {
    const endpoint = 'test-endpoint';
    server.use(
        rest.get(`${apiURL}/${endpoint}`, async (req, res, ctx) => {
            return res(ctx.status(401));
        })
    );
    let result = await client(endpoint).catch(function(error) {
        return error;
    }); // make the post request
    expect(queryCache.clear).toHaveBeenCalled();
    expect(auth.logout).toHaveBeenCalled();
    expect(result.message).toEqual("Please re-authenticate.");
});