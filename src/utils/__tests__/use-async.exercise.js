// 🐨 instead of React Testing Library, you'll use React Hooks Testing Library
import {renderHook, act} from '@testing-library/react-hooks'
// 🐨 Here's the thing you'll be testing:
import {useAsync} from '../hooks'

// 💰 I'm going to give this to you. It's a way for you to create a promise
// which you can imperatively resolve or reject whenever you want.
function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

// Use it like this:
// const {promise, resolve} = deferred()
// promise.then(() => console.log('resolved'))
// do stuff/make assertions you want to before calling resolve
// resolve()
// await promise
// do stuff/make assertions you want to after the promise has resolved

// 🐨 flesh out these tests
test('calling run with a promise which resolves', async() => {
    // 🐨 get a promise and resolve function from the deferred utility
    // 🐨 use renderHook with useAsync to get the result
    // 🐨 assert the result.current is the correct default state
    const {promise, resolve} = deferred();
    const { result } = renderHook(() => useAsync());
    expect(result.current).toEqual({
      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,
      setData: expect.any(Function),
      setError: expect.any(Function),
      error: null,
      status: 'idle',
      data: null,
      run: expect.any(Function),
      reset: expect.any(Function)
    });
    // 🐨 call `run`, passing the promise
    //    (💰 this updates state so it needs to be done in an `act` callback)
    // 🐨 assert that result.current is the correct pending state
    let runPromise;
    act(() => {
        runPromise = result.current.run(promise)
    });
    expect(result.current.status).toBe("pending");
    // 🐨 call resolve and wait for the promise to be resolved
    //    (💰 this updates state too and you'll need it to be an async `act` call so you can await the promise)
    // 🐨 assert the resolved state
    await act(async() => {
        resolve({ resolved: true });
        await runPromise;
    });
    expect(result.current.status).toBe("resolved");
    // 🐨 call `reset` (💰 this will update state, so...)
    // 🐨 assert the result.current has actually been reset
    act(() => {
        result.current.reset();
    });
    expect(result.current.status).toBe("idle");
});

test('calling run with a promise which rejects', async() => {
    // 🐨 this will be very similar to the previous test, except you'll reject the
    // promise instead and assert on the error state.
    // 💰 to avoid the promise actually failing your test, you can catch
    //    the promise returned from `run` with `.catch(() => {})`
    const {promise, reject} = deferred();
    const { result } = renderHook(() => useAsync());
    expect(result.current).toEqual({
      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,
      setData: expect.any(Function),
      setError: expect.any(Function),
      error: null,
      status: 'idle',
      data: null,
      run: expect.any(Function),
      reset: expect.any(Function)
    });
    // call run
    let runPromise;
    act(() => {
        runPromise = result.current.run(promise)
    });
    expect(result.current.status).toBe("pending");
    // reject the promise
    let rejectValue = { error: "failed" };
    await act(async() => {
        reject(rejectValue);
        await runPromise.catch((e) => e); // catch the error and return it
    });
    expect(result.current.status).toBe("rejected"); // check the status is rejected
    expect(result.current.error).toEqual(rejectValue);
    // reset
    act(() => {
        result.current.reset();
    });
    expect(result.current.status).toBe("idle");
});

test('can specify an initial state', function() {
    // 💰 useAsync(customInitialState)
    const customInitialState = { test: true, value: "testing" };
    const { result } = renderHook(() => useAsync({ data: customInitialState }));
    expect(result.current).toEqual({
      isIdle: true,
      isLoading: false,
      isError: false,
      isSuccess: false,
      setData: expect.any(Function),
      setError: expect.any(Function),
      error: null,
      status: 'idle',
      data: customInitialState,
      run: expect.any(Function),
      reset: expect.any(Function)
    });
});

test('can set the data', async() => {
    // 💰 result.current.setData('whatever you want')
    let customData = "Just testing";
    const { result } = renderHook(() => useAsync());
    act(() => {
        result.current.setData(customData);
    });
    expect(result.current.status).toBe("resolved");
    expect(result.current.data).toBe(customData);
});

test.todo('can set the error')
// 💰 result.current.setError('whatever you want')

test.todo('No state updates happen if the component is unmounted while pending')
// 💰 const {result, unmount} = renderHook(...)
// 🐨 ensure that console.error is not called (React will call console.error if updates happen when unmounted)

test.todo('calling "run" without a promise results in an early error')
