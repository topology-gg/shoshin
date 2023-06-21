import { Command } from 'commander';

const packageJson = require('../package.json');
const version: string = packageJson.version;

const program = new Command();

program
  .version(version)
  .name('ShoshinCircomSetup')
  .option('-d, --debug', 'enables verbose logging', false)
  .option('-p, --path', 'path to the Shoshin FD json')
  .parse(process.argv);

// Function code for CLI goes here
