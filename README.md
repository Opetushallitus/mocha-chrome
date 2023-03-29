
**This repository is a fork of mocha-chrome authored originally in https://github.com/shellscape/mocha-chrome**

**The version of mocha-chrome in this repository is used by https://github.com/Opetushallitus/koski**

# Opetushallitus/mocha-chrome

## Requirements

`Opetushallitus/mocha-chrome` requires Node v16.0.0 and Mocha v10.

`Opetushallitus/mocha-chrome` is a development tool, which means you can use tools like [NVM](https://github.com/creationix/nvm) and [nodenv](https://github.com/nodenv/nodenv) to manage your installed versions, and temporarily switch to v8+ to run tests on your machine. Most modern CI environments also support specifying the version of Node to run.

## Publishing a new version

Make changes to the code, commit and push.

After that, run the following commands:

```
git tag X.Y.Z
git push --tags
npm install --save Opetushallitus/mocha-chrome@X.Y.Z
```

## Getting Started

To begin, you'll need to install `Opetushallitus/mocha-chrome`:

```console
npm install Opetushallitus/mocha-chrome --save-dev
```

Then you'll need a local npm install of mocha:

```console
npm install mocha@^10 --save-dev
```

To run the tests, you'll need an HTML file with some basics:

```html
<!doctype>
<html>
  <head>
    <title>Test</title>
    <meta charset="utf-8">
    <link rel="stylesheet" href="../../node_modules/mocha/mocha.css" />
    <script src="../../node_modules/mocha/mocha.js"></script>
    <script src="../../node_modules/chai/chai.js"></script>
  </head>
  <body>
    <div id="mocha"></div>
    <script>
      expect = chai.expect;

      // add tests here

      mocha.run();
    </script>
  </body>
</html>

```

You can then add your tests either through an external script file or inline within a `<script>` tag. Running the tests is easy, either with the CLI binary, or programmatically.

## CLI

```console
$ mocha-chrome --help

  Usage
    $ mocha-chrome <file.html> [options]

  Options
    --chrome-flags              A JSON string representing an array of flags to pass to Chrome
    --chrome-launcher           Chrome launcher options (see https://github.com/GoogleChrome/chrome-launcher#launchopts)
    --ignore-console            Suppress console logging
    --ignore-exceptions         Suppress exceptions logging
    --ignore-resource-errors    Suppress resource error logging
    --log-level                 Specify a log level; trace, debug, info, warn, error
    --mocha                     A JSON string representing a config object to pass to Mocha
    --no-colors                 Disable colors in Mocha's output
    --reporter                  Specify the Mocha reporter to use
    --timeout                   Specify the test startup timeout to use
    --version

  Examples
  $ mocha-chrome test.html --no-colors
  $ mocha-chrome test.html --reporter dot
  $ mocha-chrome test.html --mocha '\{"ui":"tdd"\}'
  $ mocha-chrome test.html --chrome-flags '["--some-flag", "--and-another-one"]'
  $ mocha-chrome test.html --chrome-launcher.maxConnectionRetries=10
```

## Events

`Opetushallitus/mocha-chrome` is technically an event emitter. Due to the asynchronous nature of nearly every interaction with headless Chrome, a simple event bus is used to handle actions from the browser. You have access to those events if running `Opetushallitus/mocha-chrome` programatically.

Example usage can be found in both [test.js](test/test.js) and [bin/mocha-chrome](bin/mocha-chrome).

#### `config`

  Fired to indicate that `Opetushallitus/mocha-chrome` should configure mocha.

#### `ended`

  Fired when all tests have ended.

##### Parameters
  `stats` : `object` - A Mocha stats object. eg:

  ```js
  {
    suites: 1,
    tests: 1,
    passes: 1,
    pending: 0,
    failures: 0,
    start: '2017-08-03T02:12:02.007Z',
    end: '2017-08-03T02:12:02.017Z',
    duration: 10
  }
  ```

#### `ready`

  Fired to indicate that the mocha script in the client has been loaded.

#### `resourceFailed`

  Fired when a resource fails to load.

  ##### Parameters
  `data` : `object` - An object containing information about the resource. eg:

  ```js
  { url, method, reason }
  ```

#### `started`

  Fired when a resource fails to load.

  ##### Parameters
  `tests` : `number` - The number of tests being run.

#### `width`

  Fired to indicate that `Opetushallitus/mocha-chrome` should inform mocha of the width of the current console/terminal.

## Limitations

### Reporters

Reporters are limited to those which don't use `process.stdout.write` to manipulate terminal output. eg. `spec`, `xunit`, etc. Examples of reporters which don't presently produce expected output formatting include `dot` and `nyan`. The cause of this limitation is the lack of a good means to pipe Mocha's built-in `stdout.write` through the Chrome Devtools Protocol to `Opetushallitus/mocha-chrome`.

### Third-Party Reporters

Third party reporters are not currently supported, but support is planned. Contribution on that effort is of course welcome.

### Cookies and the `file://` Protocol

Chrome has long-since disabled cookies for files loaded via the `file://` protocol. The once-available `--enable-file-cookies` has been removed and we're left with few options. If you're in need of cookie support for your local-file test, you may use the following snippet, which will shim `document.cookie` with _very basic_ support:

```js
  Object.defineProperty(document, 'cookie', {
    get: function () {
      return this.value || '';
    },
    set: function (cookie) {
      cookie = cookie || '';

      const cutoff = cookie.indexOf(';');
      const pair = cookie.substring(0, cutoff >= 0 ? cutoff : cookie.length);
      const cookies = this.value ? this.value.split('; ') : [];

      cookies.push(pair);

      return this.value = cookies.join('; ');
    }
  });
```


## Continuous Integration

## GitHub actions

GitHub actions runs tests and lints the code accordingly.

## Testing mocha-chrome

```console
npm test
```

## License

MIT license. Originally authored in https://github.com/shellscape/mocha-chrome
