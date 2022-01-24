const chromeLauncher = require("chrome-aws-lambda");
const lighthouse = require("lighthouse");
const { URL } = require('url');

const defaultFlags = [
  "--headless",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--no-zygote",
  "--no-sandbox",
  "--single-process",
  "--hide-scrollbars"
];

module.exports = function createLighthouse(url, options = {}, config) {
  options.output = options.output || "html";
  const log = options.logLevel ? require("lighthouse-logger") : null;
  if (log) {
    log.setLevel(options.logLevel);
  }
  var browser = await chromeLauncher.puppeteer.launch({
    args: chromeLauncher.args,
    defaultViewport: chromeLauncher.defaultViewport,
    executablePath: await chromeLauncher.executablePath,
    ignoreHTTPSErrors: true
  })
  if (!options.chromeFlags) {
    options.chromeFlags = defaultFlags;
  }
  options.port = new URL(browser.wsEndpoint()).port;
  
  return {
    browser,
    log,
    start() {
      return lighthouse(url, options);
    }
  };
};
