import Microcosm from '../../src/microcosm'

test('passes the action and repo as arguments', function () {
  let spy = jest.fn()
  let repo = new Microcosm()
  let action = repo.push(n => spy)

  expect(spy).toHaveBeenCalledWith(action, repo)
})
