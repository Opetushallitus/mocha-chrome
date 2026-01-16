const MAX_LAUNCH_RETRIES = 10
const RETRY_DELAY_MS = 1000

function delay (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

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

  let lastError
  for (let attempt = 1; attempt <= MAX_LAUNCH_RETRIES; attempt++) {
    try {
      const instance = await ChromeLauncher.launch(opts)
      log.info('Chrome Instance launched')
      return instance
    } catch (err) {
      lastError = err
      log.warn(`Chrome launch attempt ${attempt}/${MAX_LAUNCH_RETRIES} failed: ${err.message}`)
      if (attempt < MAX_LAUNCH_RETRIES) {
        log.info(`Retrying in ${RETRY_DELAY_MS}ms...`)
        await delay(RETRY_DELAY_MS)
      }
    }
  }

  throw lastError
}
