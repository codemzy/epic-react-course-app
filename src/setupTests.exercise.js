// this isn't used in the soultion. Only in the extra credit
import {server} from 'test/server';

// extra 2

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
