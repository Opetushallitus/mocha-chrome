module.exports = async function createInstance (log, options) {
  const flags = [
    '--disable-background-timer-throttling',
    '--disable-default-apps',
    '--disable-device-discovery-notifications',
    '--disable-gpu',
    '--disable-popup-blocking',
    '--disable-renderer-backgrounding',
    '--disable-translate',
    '--headless',
    '--no-default-browser-check',
    '--no-first-run',
    '--no-sandbox'
  ].concat(options.chromeFlags || [])

  const opts = Object.assign({}, options.chromeLauncher, {
    chromeFlags: [...new Set(flags)],
    logLevel: options.logLevel,
    port: 12345,
    maxConnectionRetries: 10,
    connectionPollInterval: 1000
  })

  const ChromeLauncher = await import('chrome-launcher')

  const instance = ChromeLauncher.launch(opts)

  log.info('Chrome Instance launched')

  return instance
}
