// @flow
import jsonpack from 'jsonpack'
import aes from 'browserify-aes'
import createHash from 'sha.js'
const session = {
  encrypt (txt, pwd) {
    try {
      let cipher = aes.createCipher('aes-256-cbc', pwd)
      let result = cipher.update(txt, 'utf8', 'base64')
      result += cipher.final('base64')
      return result
    } catch (e) {
      return false
    }
  },

  decrypt (enc, pwd) {
    try {
      let decipher = aes.createDecipher('aes-256-cbc', pwd)
      let result = decipher.update(enc, 'base64', 'utf8') + decipher.final('utf8')
      return result
    } catch (e) {
      return false
    }
  },

  compress (data) {
    return jsonpack.pack(data)
  },

  uncompress (data) {
    return jsonpack.unpack(data)
  },

  hash (key) {
    let sha = createHash('sha256')
    return sha.update(key, 'utf8').digest('hex')
  },

  pack (data, keyword) {
    return session.encrypt(session.compress(data), keyword)
  },

  unpack (data, keyword) {
    let dec = session.decrypt(data, keyword)
    return session.uncompress(dec)
  }
}

global.onmessage = function (e) {
  var args = session.uncompress(e.data)
  var workerResult = null
  try {
    workerResult = session[args.action](args.data, args.password)
  } catch (e) {
    throw e
  }

  postMessage({ result: workerResult, id: args.now })
}
