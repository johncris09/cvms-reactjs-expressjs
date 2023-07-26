function FormatDate(timestamp) {
  const date = new Date(timestamp)
  const formattedDate = date.toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  })
  return formattedDate
}

export default FormatDate
