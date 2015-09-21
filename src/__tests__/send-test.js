let Microcosm = require('../Microcosm')
let Transaction = require('../Transaction')
let assert = require('assert')
let send = require('../send')
let lifecycle = require('../lifecycle')

describe('sending actions', function() {

  let action = a => a

  it ('always sends actions in the context of the store', function(done) {
    let app = new Microcosm()

    let store = {
      register() {
        return {
          [action](state) {
            assert.equal(this, store)
            done()
          }
        }
      }
    }

    app.addStore('test', store).push(action)
  })

  it ('returns the same state if a handler is not provided', function() {
    let app = new Microcosm()

    app.addStore('test', {
      getInitialState() {
        return 'test'
      }
    })

    app.start()

    app.push(action, [], function() {
      assert.equal(app.state.test, 'test')
    })
  })

  it ('allows handlers to not be functions', function() {
    let app = new Microcosm()

    app.addStore('test', {
      register() {
        return {
          [action]: 5
        }
      }
    })

    app.push(action, [], function() {
      assert.equal(app.state.test, 5)
    })
  })

  it ('sends all application state as the third argument', function(done) {
    let app = new Microcosm()

    app.addStore('test', {
      register() {
        return {
          [action](subset, body, state) {
            assert.deepEqual(state, app.state)
            done()
          }
        }
      }
    })

    app.push(action)
  })

  describe('Lifecycle passthrough', function() {

    it ('allows defined lifecycle methods to bypass the register function', function() {
      let app = new Microcosm()

      app.addStore('test', {
        getInitialState() {
          return 'test'
        }
      })

      app.push(lifecycle.willStart, [], function() {
        assert.equal(app.state.test, 'test')
      })
    })

    it ('allows lifecycle methods as registered actions', function() {
      let app = new Microcosm()

      app.addStore('test', {
        register() {
          return {
            [lifecycle.willStart]: 'test'
          }
        }
      })

      app.start(function() {
        assert.equal(app.state.test, 'test')
      })
    })

    it ('ignores methods defined by the store that are not lifecycle methods matching dispatched types', function() {
      let app = new Microcosm()

      app.addStore('test', {
        foo() {
          return 'test'
        }
      })
      let answer = app.dispatch(app.state, { type: 'foo' })

      assert.equal(answer.test, undefined)
    })

  })

})
