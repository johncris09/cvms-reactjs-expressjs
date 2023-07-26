function FormatDateTime(timestamp) {
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  })
  return formattedDate
}

export default FormatDateTime
