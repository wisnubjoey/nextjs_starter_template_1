#!/usr/bin/env node

import { promises as fs } from 'fs';
import path from 'path';
import { promisify } from 'util';
import { exec as execCallback } from 'child_process';
import inquirer from 'inquirer';
import { program } from 'commander';
import ora from 'ora';

const exec = promisify(execCallback);

program
  .version('1.0.0')
  .argument('[project-name]', 'Name of the project')
  .option('-y, --yes', 'Skip prompts and use default options')
  .parse(process.argv);

async function main() {
  try {
    let projectName = program.args[0];

    if (!projectName && !program.opts().yes) {
      const answer = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'What is your project name?',
          default: 'next-app'
        }
      ]);
      projectName = answer.projectName;
    } else if (!projectName) {
      projectName = 'next-app';
    }

    const projectDir = path.resolve(process.cwd(), projectName);

    if (await fs.access(projectDir).then(() => true).catch(() => false)) {
      console.error(`Error: Directory ${projectName} already exists.`);
      process.exit(1);
    }

    console.log(`Creating a new Bjoey Next.js app in ${projectDir}...`);

    await fs.mkdir(projectDir, { recursive: true });

    try {
      await exec('git --version', { stdio: 'ignore' });
    } catch {
      console.error('Git is not installed. Please install Git and try again.');
      process.exit(1);
    }

    const spinner = ora('Cloning template repository...').start();
    await exec(`git clone https://github.com/wisnubjoey/nextjs_starter_template_1.git ${projectDir}`);
    spinner.succeed('Template repository cloned successfully');

    await fs.rm(path.join(projectDir, '.git'), { recursive: true, force: true });

    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    packageJson.name = projectName;
    packageJson.version = '0.1.0';
    await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));

    spinner.start('Installing dependencies...');
    await exec('npm install', { cwd: projectDir });
    spinner.succeed('Dependencies installed successfully');

    console.log(`
Success! Created ${projectName} at ${projectDir}

Full instruction to run the project: https://github.com/wisnubjoey/nextjs_starter_template_1

Inside that directory, you can run several commands:

  npm run dev
    Starts the development server.

  npm run build
    Builds the app for production.

  npm start
    Runs the built app in production mode.

We suggest that you begin by typing:

  cd ${projectName}
  npm run dev

Project Generated Successfully !
    `);

    // Tambahkan langkah untuk menghapus index.js
    await removeIndexJs(projectDir);
  } catch (error) {
    console.error('An error occurred:', error.message);
    if (error.stack) console.error(error.stack);
    process.exit(1);
  }
}

// Fungsi untuk menghapus index.js
async function removeIndexJs(projectDir) {
  const indexJsPath = path.join(projectDir, 'index.js');
  try {
    await fs.unlink(indexJsPath);
    console.log('Happy Coding!');
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('index.js does not exist in the generated project');
    } else {
      console.error('Error removing index.js:', error.message);
    }
  }
}

main().catch((error) => {
  console.error('An unexpected error occurred:', error);
  process.exit(1);
});