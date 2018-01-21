/**
 * Mocking client-server processing
 */
const __tags = {
  "root":["soup"]
}

export default {
  getTags (cb) {
    setTimeout(() => cb(__tags), 100)
  }
}
