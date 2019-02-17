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
  .default(`port`, config.server.port)

  .alias(`b`, `haxroomie-port`)
  .describe(`b`, `Set a local port that will be used to communicate with headless browser.`)
  .default(`haxroomie-port`, config.haxroomie.port)

  .alias(`w`, `window`)
  .boolean(`window`)
  .describe(`window`, `Makes haxroomie run windowed (useful for debugging)`)
  .default(`window`, config.haxroomie.window)

  .alias(`s`, `secret`)
  .describe(`s`, `Set a secret salt used to sign the session ID cookie.`)
  .default(`secret`, config.server.secret)

  .alias(`e`, `secure`)
  .describe(`secure`, `Secure the sessions (requires HTTPS support)`)
  .default(`secret`, config.server.secure)

  .alias(`sq`, `sqlite-storage-path`)
  .describe(`sq`, `Set a path from where sqlite database will used from.`)
  .default(`sqlite-storage-path`, config.server.storage)

  .argv;

(async function bootstrap() {

  const haxroomie = new Haxroomie({
    headless: !argv.window,
    port: argv.haxroomiePort
  });
  await haxroomie.createBrowser();

  const server = new HRWebServer({
    haxroomie: haxroomie,
    port: argv.port,
    secret: argv.secret,
    secure: argv.secure,
    storage: argv.storage,
    defaultUser: config.server.user
  });
  await server.listen();
  logger.info(`Haxroomie web started.`);
})();