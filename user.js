const logger = require('./src/logging').logger;
const config = require('./config');
const database = require('./src/database')(config.server.storage);

const argv = require(`yargs`)
  .usage(`Usage: $0 <command> [options]`)

  .command('add [name] [password]', 'adds a new user', (yargs) => {
    yargs
      .positional('name', {
        describe: 'user name'
      })
      .positional('password', {
        describe: 'user password'
      })
      .demand(['name', 'password'])
  })

  .command('remove [name]', 'removes an user', (yargs) => {
    yargs
      .positional('name', {
        describe: 'user name'
      })
      .demand('name')
  })

  .command('update [name] [password]', 'updates user password', (yargs) => {
    yargs
      .positional('name', {
        describe: 'user name',
      })
      .positional('password', {
        describe: 'new user password'
      })
      .demand(['name', 'password'])
  })

  .demandCommand(1, 'You need to give the command (add/remove/update)')
  .argv;

  (async function app() {
    try {
      await database.init();
      await runCommand();
    } catch (err) {
      logger.error(err.stack);
      process.exit(1);
    }
  })();

  async function runCommand() {
    let command = argv._[0];

    switch (command) {
      case 'add':
        return database.createUser({
          name: argv.name,
          password: argv.password
        }, true)
      case 'remove':
        return database.removeUser({
          name: argv.name
        })
      case 'update':
        return database.updateUser({
          name: argv.name,
          password: argv.password
        })
    }
  }