/**
 * Interactive CLI prompts
 */

import chalk from 'chalk';
import inquirer from 'inquirer';

/**
 * Prompts for email address
 */
export async function promptEmail(): Promise<string> {
  const { email } = await inquirer.prompt<{ email: string }>([
    {
      type: 'input',
      name: 'email',
      message: 'Enter your email:',
      validate: (input: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(input) || 'Please enter a valid email address';
      },
    },
  ]);

  return email;
}

/**
 * Prompts for password
 */
export async function promptPassword(): Promise<string> {
  const { password } = await inquirer.prompt<{ password: string }>([
    {
      type: 'password',
      name: 'password',
      message: 'Enter your password:',
      mask: '*',
      validate: (input: string) => {
        return input.length > 0 || 'Password cannot be empty';
      },
    },
  ]);

  return password;
}

/**
 * Prompts for a file path
 */
export async function promptFilePath(message: string, defaultPath?: string): Promise<string> {
  const { path } = await inquirer.prompt<{ path: string }>([
    {
      type: 'input',
      name: 'path',
      message,
      default: defaultPath,
      validate: (input: string) => {
        return input.length > 0 || 'Path cannot be empty';
      },
    },
  ]);

  return path;
}

/**
 * Prompts for confirmation
 */
export async function promptConfirm(message: string, defaultValue = false): Promise<boolean> {
  const { confirmed } = await inquirer.prompt<{ confirmed: boolean }>([
    {
      type: 'confirm',
      name: 'confirmed',
      message,
      default: defaultValue,
    },
  ]);

  return confirmed;
}

/**
 * Prompts for a choice from a list
 */
export async function promptChoice<T extends string>(
  message: string,
  choices: T[],
  defaultChoice?: T,
): Promise<T> {
  const { choice } = await inquirer.prompt<{ choice: T }>([
    {
      type: 'list',
      name: 'choice',
      message,
      choices,
      default: defaultChoice,
    },
  ]);

  return choice;
}

/**
 * Prompts for login method selection
 */
export async function promptLoginMethod(): Promise<'manual' | 'auto' | 'profile'> {
  const choices = [
    {
      name: `${chalk.bold('Manual')} - Export cookies from browser`,
      value: 'manual' as const,
    },
    {
      name: `${chalk.bold('Automated')} - Login with email/password`,
      value: 'auto' as const,
    },
    {
      name: `${chalk.bold('Profile')} - Reuse existing profile`,
      value: 'profile' as const,
    },
  ];

  const { method } = await inquirer.prompt<{ method: 'manual' | 'auto' | 'profile' }>([
    {
      type: 'list',
      name: 'method',
      message: 'Select login method:',
      choices,
    },
  ]);

  return method;
}

/**
 * Prompts for output format selection
 */
export async function promptOutputFormat(): Promise<'json' | 'table' | 'text'> {
  return promptChoice('Select output format:', ['json', 'table', 'text'], 'text');
}
