/**
 * Store
 * Used to provide default values for a store configuration
 */

let attempt = require('./attempt')
let tag     = require('./tag')

let Store = {

  getInitialState(store) {
    return attempt(store, 'getInitialState')
  },

  serialize(store, state) {
    return attempt(store, 'serialize', [ state ], state)
  },

  deserialize(store, state) {
    return attempt(store, 'deserialize', [ state ], state)
  },

  register(store) {
    return attempt(store, 'register', [], undefined, store)
  },

  send(store, state, transaction) {
    let { action, body } = transaction

    tag(action)

    return attempt(Store.register(store), action.toString(), [ state, body ], state, store)
  }

}

module.exports = Store
