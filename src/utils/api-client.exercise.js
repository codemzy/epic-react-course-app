function client(endpoint, customConfig = {}) {
  const config = {
    method: 'GET',
    ...customConfig,
  }

  return window
    .fetch(`${process.env.REACT_APP_API_URL}/${endpoint}`, config)
    .then(async function(response) { // fetch will always respond even if error, will only error if server request fails
        let data = await response.json(); // get data if successful or not
        if (response.ok) { // if response is ok then no error from response
            return data;
        } else { // there was an error
            return Promise.reject(data); // data is an error in this case
        }
    });
}

export {client}
