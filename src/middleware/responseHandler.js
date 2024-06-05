module.exports = (req, res, next) => {
  res.sendResponse = (status, code, message, data = null) => {
    const response = { code, message }
    if (data) {
      response.data = data
    }
    res.status(status).send(response)
  }
  next()
}
