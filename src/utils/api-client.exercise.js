import * as auth from '../auth-provider';
const apiURL = process.env.REACT_APP_API_URL

function client(
  endpoint,
  {token, headers: customHeaders, ...customConfig} = {},
) {
  const config = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
      ...customHeaders,
    },
    ...customConfig,
  }

  return window.fetch(`${apiURL}/${endpoint}`, config).then(async response => {
    const data = await response.json()
    if (response.ok) {
      return data
    } else {
        if (response.status === 401) {
            auth.logout(); // logout the user
            window.location.assign(window.location); // refresh page
            return Promise.reject('Please re-authenticate');
        }
        return Promise.reject(data)
    }
  })
}

export {client}
