// @flow
const localStorage = {
  create: async function () {

  },
  update: async function () {

  },
  get: function (keys) {
    return new Promise(function (resolve, reject) {
      try {
        var data = window.localStorage.getItem(keys.join(':'))
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  getAll: function (keys) {
    return new Promise(function (resolve, reject) {
      try {
        var data = []
        for (var i = 0; i < window.localStorage.length; i++) {
          if (window.localStorage.key(i).indexOf(keys.join(':') + ':') === 0) {
            data.push({
              id: window.localStorage.key(i),
              data: window.localStorage.getItem(window.localStorage.key(i))
            })
          }
        }
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  set: function (keys, data) {
    return new Promise(function (resolve, reject) {
      try {
        window.localStorage.setItem(keys.join(':'), data)
        resolve(keys)
      } catch (e) {
        reject(e)
      }
    })
  },
  setMany: function (data) {
    return new Promise(function (resolve, reject) {
      try {
        data.forEach(function (item) {
          window.localStorage.setItem(item.id, item.data)
        })
        resolve(data)
      } catch (e) {
        reject(e)
      }
    })
  },
  del: function (keys) {
    return new Promise(function (resolve, reject) {
      try {
        window.localStorage.removeItem(keys.join(':'))
        resolve(keys)
      } catch (e) {
        reject(e)
      }
    })
  },
  delSome: function (keys) {
    return new Promise(function (resolve, reject) {
      try {
        for (var i = 0; i < window.localStorage.length; i++) {
          if (keys.indexOf(window.localStorage.key(i)) !== -1) {
            window.localStorage.removeItem(window.localStorage.key(i))
          }
        }
        resolve(keys)
      } catch (e) {
        reject(e)
      }
    })
  },
  delAll: function (keys) {
    return new Promise(function (resolve, reject) {
      try {
        for (var i = 0; i < window.localStorage.length; i++) {
          if (window.localStorage.key(i).indexOf(keys.join(':') + ':') === 0) {
            window.localStorage.removeItem(window.localStorage.key(i))
          }
        }
        resolve(keys)
      } catch (e) {
        reject(e)
      }
    })
  },
  free: function (keys) {
    return new Promise(function (resolve, reject) {
      try {
        var result = true
        for (var i = 0; i < window.localStorage.length; i++) {
          if (window.localStorage.key(i) === keys.join(':')) {
            result = false
            break
          }
        }
        if (result) {
          resolve(keys)
        } else {
          reject(new Error('IS_NOT_FREE'))
        }
      } catch (e) {
        reject(e)
      }
    })
  },
  exist: function (keys) {
    return new Promise(function (resolve, reject) {
      try {
        var result = false
        for (var i = 0; i < window.localStorage.length; i++) {
          if (window.localStorage.key(i) === keys.join(':')) {
            result = window.localStorage.getItem(window.localStorage.key(i))
            break
          }
        }
        if (result) {
          resolve(result)
        } else {
          reject(new Error('DOES_NOT_EXIST'))
        }
      } catch (e) {
        reject(e)
      }
    })
  }
}

export { localStorage }
