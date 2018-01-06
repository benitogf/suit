// @flow
import { expect } from 'chai'
import wh from '@/lib/session'

describe('session', () => {
  it('should have a version [1]', () => {
    expect(wh.version).to.eq(1)
  })
  it('should create a db', async () => {
    expect(wh.get).to.be.an.instanceOf(Function)
  })
  it('should set', async () => {
    let key = ['item', '1']
    var keys = await wh.set(key, { store: 'local' })
    expect(keys).to.eq(key.join(':'))
  })
  it('should get', async () => {
    var item = await wh.get(['item', '1'])
    expect(item.store).to.eq('local')
  })
})
