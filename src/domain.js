/**
 * Domain
 * This is the base class with which all domains draw their common
 * behavior. It can also be extended.
 */

const EMPTY = {}

export default class Domain {

  /**
   * Ensure that the given object supports the baseline requirements
   * of Domains.
   */
  static ensure (obj) {

    for (var key in Domain.prototype) {
      if (Domain.prototype.hasOwnProperty(key) && (key in obj === false)) {
        obj[key] = Domain.prototype[key]
      }
    }

    return obj
  }

  /**
   * Setup runs right after a domain is added to a Microcosm, but before
   * it rebases state to include the domain's `getInitialState` value. This
   * is useful for one-time setup instructions
   */
  setup () {
    // NOOP
  }

  /**
   * Runs whenever `Microcosm::teardown` is invoked. Useful for
   *cleaning up work done in `setup()`.
   */
  teardown () {
    // NOOP
  }

  /**
   * A default register function that just returns an empty object. This helps
   * keep other code from branching.
   *
   * @param {string} type - The action type to respond to
   * @return {object} a mapping of registrations
   */
  register (type) {
    // NOOP
    return EMPTY
  }

  /**
   * Given a next and previous state, should the value be committed
   * to the next revision?
   *
   * @param {any} next - the next state
   * @param {any} last - the last state
   *
   * @return {boolean} Should the state update?
   */
  shouldCommit (last, next) {
    return true
  }

  /**
  * This is the actual operation used to write state to a Microcosm.
  * Normally this isn't overridden, but it is useful for staging custom
  * domain behavior. This is currently a private API.
  *
  * @private
  * @param {object} state - The current application state
  * @param {any} value - The value to assign to a key
  * @return {object} newState - The next state for the Microcosm instance
  */
  stage (last, next) {
    return next
  }

  /**
   * A middleware method for determining what exactly is assigned to
   * repo.state. This gives libraries such as ImmutableJS a chance to serialize
   * into a primitive JavaScript form before being publically exposed.
   *
   * @param {any} next - The next state for the domain
   */
  commit (next) {
    return next
  }


  /**
   * Add a sub-domain. This domain will be relative to the parent
   *
   * TODO: Could there be a time in the future when Domains are just
   * Microcosms?
   */
   addDomain (key, config) {
     this._realm.add([this._key].concat(key), config)

     return this
   }

}
