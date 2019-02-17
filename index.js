const logger = require('./src/logging').logger;

process.on(`unhandledRejection`, (error, p) => {
  logger.error(`Unhandled Promise Rejection:\n${error.stack}`);
  process.exit(1);
});

const config = require(`./config`);
const { Haxroomie } = require(`haxroomie`);
const HRWebServer = require(`./src/HRWebServer`);

const argv = require(`yargs`)
  .usage(`Usage: $0 <command> [options]`)

  .alias(`p`, `port`)
  .describe(`p`, `Set a port that the app is listening to for HTTP connections.`)

  .alias(`b`, `haxroomie-port`)
  .describe(`haxroomie-port`, `Set a local port that will be used to communicate with headless browser.`)

  .alias(`w`, `window`)
  .describe(`window`, `Makes haxroomie run windowed (useful for debugging)`)

  .alias(`e`, `secure`)
  .describe(`secure`, `Secure the sessions (requires HTTPS support)`)

  .alias(`s`, `secret`)
  .describe(`secret`, `Set a secret salt used to sign the session ID cookie.`)

  .alias(`o`, `storage`)
  .describe(`storage`, `Set a path from where sqlite database will used from.`)

  .argv;

(async function bootstrap() {

  let cfg = parseConfig(config);

  const haxroomie = new Haxroomie({
    headless: !cfg.window,
    port: argv.haxroomiePort
  });
  await haxroomie.createBrowser();

  const server = new HRWebServer({
    haxroomie: haxroomie,
    port: cfg.port,
    secret: cfg.secret,
    secure: cfg.secure,
    storage: cfg.storage,
    defaultUser: cfg.defaultUser
  });
  await server.listen();
  logger.info(`Haxroomie web started.`);
})();

function parseConfig(config) {
  let cfg = {
    window: argv.hasOwnProperty('window') ? argv.window : config.haxroomie.window,
    haxroomiePort: argv.haxroomiePort || config.haxroomie.port,
    port: argv.port || config.server.port,
    secret: argv.secret || config.server.secret,
    secure: argv.hasOwnProperty('secure') ? argv.secure : config.server.secure,
    storage: argv.storage || config.server.storage,
    defaultUser: config.server.user
  }

  return cfg;
}