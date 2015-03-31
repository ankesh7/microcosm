/**
 * Install
 * A simple FIFO queue for installing plugins
 */

export default function install ([plugin, ...tail], app, callback) {
  if (!plugin) return callback()

  let [ driver, options ] = plugin

  driver.register(app, options, function(err) {
    if (err) throw err
    install(tail, app, callback)
  })
}