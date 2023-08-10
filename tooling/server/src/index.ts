import { Command } from 'commander';
import figlet from "figlet";
import { runRank } from 'next-exp/src/helpers/pvpHelper';

const program = new Command();
console.log(figlet.textSync("Shoshin"));

program
    .version("1.0.0")
    .description("Shoshin CLI")
    .command("rank")
    .action()
    
const options = program.opts();

if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
  
if(options.rank === true){
    console.log('run rank');
    
}