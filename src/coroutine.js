function isPromise(obj, type) {
  return !!obj && (type === 'object' || type === 'function') && typeof obj.then === 'function'
}

/**
 * Coroutine is used by an action to determine how it should resolve the
 * body of their associated behavior.
 * @private
 */
export default function coroutine (action, body, repo) {
  let type = typeof body

  /**
   * Provide support for Promises:
   *
   * 1. Open the action
   * 2. Unwrap the promise using `setTimeout`, which prevents errors
   *    elsewhere in the dispatch execution process from being trapped.
   * 3. If the promise is rejected, reject the action
   * 4. Otherwise resolve the action with the returned body
   */
  if (isPromise(body, type)) {
    action.open()

    body.then(
      result => global.setTimeout(() => action.resolve(result), 0),
      error  => global.setTimeout(() => action.reject(error), 0)
    )

    return action
  }

  /**
   * Check for thunks. An escape hatch to direction work with an
   * action. It is triggered by returning a function from a
   * behavior. This middleware will execute that function with the
   * action as the first argument.
   */
  if (type === 'function') {
    body(action, repo)

    return action
  }

  // Otherwise just return a resolved action
  return action.resolve(body)
}
