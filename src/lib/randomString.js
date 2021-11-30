const _ = require('lodash')

module.exports = (length = 10) => {
    var chars = "abcdefghijklmnopqrstufwxyzABCDEFGHIJKLMNOPQRSTUFWXYZ1234567890"
    var pwd = _.sampleSize(chars, length)  // lodash v4: use _.sampleSize
    return pwd.join("")
}