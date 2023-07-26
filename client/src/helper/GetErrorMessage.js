function GetErrorMessage(error) {
  if (error.response) {
    // The request was made and the server responded with a status code that falls out of the range of 2xx
    console.error('Server responded with an error:', error.response.data)
    console.error('Status code:', error.response.status)
    console.error('Response headers:', error.response.headers)
    return error.response.data.error
  } else if (error.request) {
    // The request was made, but no response was received
    console.error('No response received:', error.request)
    return 'No response received from the server'
  } else {
    // Something happened in setting up the request that triggered an error
    console.error('Error setting up the request:', error.message)
    return 'Error setting up the request'
  }
}

export default GetErrorMessage
