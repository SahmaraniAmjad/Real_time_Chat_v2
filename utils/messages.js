const moment = require('moment');

function formatMessage(username, text) {
  // it returns an object
  return {
    username,
    text,
    time: moment().format('h:mm a')
  }
}

// we need to export it to be able to use it
module.exports = formatMessage;