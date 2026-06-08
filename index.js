import readline from "readline";
import chalk from "chalk";
import { chat, createSession } from "./chat.js";
import { companyData } from "./data/company.js";

const messages = createSession();

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function printHeader() {
  console.log(chalk.cyan("╔══════════════════════════════════════════════╗"));
  console.log(chalk.cyan("║  ") + chalk.bold.yellow("⚡ Volt Corp Chatbot") + chalk.cyan("               ║"));
  console.log(chalk.cyan("║  ") + chalk.gray(`${companyData.phone} | ${companyData.hours}`) + chalk.cyan("  ║"));
  console.log(chalk.cyan("║  ") + chalk.gray("'exit' ออก  |  'clear' ล้างประวัติ") + chalk.cyan("        ║"));
  console.log(chalk.cyan("╚══════════════════════════════════════════════╝\n"));
}

function prompt() {
  rl.question(chalk.blue("👤 คุณ: "), async (input) => {
    const text = input.trim();
    if (!text) return prompt();

    if (text.toLowerCase() === "exit") {
      console.log(chalk.cyan("ขอบคุณที่ใช้บริการ Volt Corp ครับ!"));
      rl.close();
      process.exit(0);
    }

    if (text.toLowerCase() === "clear") {
      messages.splice(1);
      console.clear();
      printHeader();
      console.log(chalk.gray("ล้างประวัติแล้ว\n"));
      return prompt();
    }

    try {
      const { reply, toolsUsed } = await chat(messages, text);

      if (toolsUsed.length > 0) {
        for (const t of toolsUsed) {
          console.log(chalk.yellow(`\n🔧 Tool: ${t.name}`) + chalk.gray(` → ${String(t.result).slice(0, 150)}`));
        }
      }

      console.log(chalk.green("⚡ Volt Corp:") + chalk.white(reply) + "\n");
    } catch (err) {
      console.error(chalk.red(`❌ Error: ${err.message}\n`));
    }

    prompt();
  });
}

console.clear();
printHeader();
prompt();
