// @flow
import { localStorage } from '@/lib/session/localStorage'
import { indexedDB } from '@/lib/session/indexedDB'
import Dexie from 'dexie'

/** Check if storage is persisted already.
  @returns {Promise<boolean>} Promise resolved with true if current origin is
  using persistent storage, false if not, and undefined if the API is not
  present.
*/
async function isStoragePersisted () {
  return await navigator.storage && navigator.storage.persisted ? navigator.storage.persisted() : undefined
}

/** Tries to convert to persisted storage.
  @returns {Promise<boolean>} Promise resolved with true if successfully
  persisted the storage, false if not, and undefined if the API is not present.
*/
// async function persist () {
//   return await navigator.storage && navigator.storage.persist ? navigator.storage.persist() : undefined
// }

/** Queries available disk quota.
  @see https://developer.mozilla.org/en-US/docs/Web/API/StorageEstimate
  @returns {Promise<{quota: number, usage: number}>} Promise resolved with
  {quota: number, usage: number} or undefined.
*/
async function showEstimatedQuota () {
  return await navigator.storage && navigator.storage.estimate ? navigator.storage.estimate() : undefined
}

/** Tries to persist storage without ever prompting user.
  @returns {Promise<string>}
    'never' In case persisting is not ever possible. Caller don't bother
      asking user for permission.
    'prompt' In case persisting would be possible if prompting user first.
    'persisted' In case this call successfully silently persisted the storage,
      or if it was already persisted.
*/
async function tryPersistWithoutPromtingUser () {
  if (!navigator.storage || !navigator.storage.persisted) {
    return 'never'
  }
  let persisted = await navigator.storage.persisted()
  if (persisted) {
    return 'persisted'
  }
  if (!navigator.permissions || !navigator.permissions.query) {
    return 'prompt' // It MAY be successful to prompt. Don't know.
  }
  // const permission = await navigator.permissions.query({
  //   name: 'persistent-storage'
  // })
  // if (permission.status === 'granted') {
  persisted = await navigator.storage.persist()
  if (persisted) {
    return 'persisted'
  } else {
    throw new Error('Failed to persist')
  }
}

async function initStoragePersistence () {
  const persist = await tryPersistWithoutPromtingUser()
  switch (persist) {
    case 'never':
      console.log('Not possible to persist storage')
      break
    case 'persisted':
      console.log('Successfully persisted storage silently')
      break
    case 'prompt':
      console.log('Not persisted, but we may prompt user when we want to.')
      break
  }
}

class Portal {
  constructor (opt) {
    try {
      if (window.Worker) {
        window.sessionWorker = new Worker('/static/worker.js')
      }
      isStoragePersisted().then(state => {
        if (!state) {
          initStoragePersistence()
        } else {
          console.log('persisted')
        }
      })

      showEstimatedQuota().then(quota => {
        console.log(quota)
      })
      this.quota = showEstimatedQuota
      this.name = (opt && opt.name) ? opt.name : 'suit'
      this.version = (opt && opt.version) ? opt.version : 1
      this.db = new Dexie(this.name)
      this.db.version(this.version).stores({
        items: '&id, data, created, updated'
      })
      Object.assign(this, indexedDB)
    } catch (e) {
      console.log(e)
      Object.assign(this, localStorage)
    }
  }
}

export { Portal }
