// @flow
import { localStorage } from '@/lib/session/localStorage'
import { indexedDB } from '@/lib/session/indexedDB'
import Dexie from 'dexie'

class C137 {
  constructor (opt) {
    try {
      if (window.Worker) {
        window.sessionWorker = new Worker('/static/worker.js')
      }
      this.name = (opt && opt.name) ? opt.name : 'c137'
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

export { C137 }
