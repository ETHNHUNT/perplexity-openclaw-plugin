/**
 * Output formatting utilities
 */

import chalk from 'chalk';
import type { OutputFormat } from '../../types/cli.js';

/**
 * Formats output based on the specified format
 */
export function formatOutput(data: unknown, format: OutputFormat = 'text'): string {
  switch (format) {
    case 'json':
      return formatJson(data);
    case 'table':
      return formatTable(data);
    case 'text':
    default:
      return formatText(data);
  }
}

/**
 * Formats data as JSON
 */
function formatJson(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Formats data as text
 */
function formatText(data: unknown): string {
  if (typeof data === 'string') {
    return data;
  }

  if (typeof data === 'object' && data !== null) {
    return Object.entries(data)
      .map(([key, value]) => {
        if (typeof value === 'object') {
          return `${chalk.bold(key)}:\n${formatText(value)}`;
        }
        return `${chalk.bold(key)}: ${value}`;
      })
      .join('\n');
  }

  return String(data);
}

/**
 * Formats data as a table
 */
function formatTable(data: unknown): string {
  if (Array.isArray(data)) {
    if (data.length === 0) {
      return chalk.dim('No data to display');
    }

    const firstItem = data[0];
    if (typeof firstItem === 'object' && firstItem !== null) {
      const columns = Object.keys(firstItem);
      const columnWidths = calculateColumnWidths(data, columns);

      let table = formatTableHeader(columns, columnWidths);
      table += '\n' + formatTableSeparator(columnWidths);

      for (const item of data) {
        table += '\n' + formatTableRow(item, columns, columnWidths);
      }

      return table;
    }
  }

  // Fall back to text format
  return formatText(data);
}

/**
 * Calculates column widths for table formatting
 */
function calculateColumnWidths(data: unknown[], columns: string[]): number[] {
  return columns.map((column) => {
    const headerLength = column.length;
    const maxDataLength = Math.max(
      ...data.map((item) => {
        const value = (item as Record<string, unknown>)[column];
        return String(value ?? '').length;
      }),
    );
    return Math.min(Math.max(headerLength, maxDataLength), 50);
  });
}

/**
 * Formats table header
 */
function formatTableHeader(columns: string[], widths: number[]): string {
  return columns.map((column, index) => chalk.bold(column.padEnd(widths[index]!))).join(' | ');
}

/**
 * Formats table separator
 */
function formatTableSeparator(widths: number[]): string {
  return widths.map((width) => '-'.repeat(width)).join('-+-');
}

/**
 * Formats a table row
 */
function formatTableRow(item: unknown, columns: string[], widths: number[]): string {
  return columns
    .map((column, index) => {
      const value = (item as Record<string, unknown>)[column];
      const stringValue = String(value ?? '');
      const truncated =
        stringValue.length > widths[index]!
          ? stringValue.substring(0, widths[index]! - 3) + '...'
          : stringValue;
      return truncated.padEnd(widths[index]!);
    })
    .join(' | ');
}

/**
 * Formats a success message
 */
export function formatSuccess(message: string): string {
  return chalk.green(`✓ ${message}`);
}

/**
 * Formats an error message
 */
export function formatError(message: string): string {
  return chalk.red(`✗ ${message}`);
}

/**
 * Formats a warning message
 */
export function formatWarning(message: string): string {
  return chalk.yellow(`⚠ ${message}`);
}

/**
 * Formats an info message
 */
export function formatInfo(message: string): string {
  return chalk.blue(`ℹ ${message}`);
}

/**
 * Formats a section header
 */
export function formatHeader(title: string): string {
  return chalk.bold.underline(title);
}

/**
 * Formats a list
 */
export function formatList(items: string[]): string {
  return items.map((item) => `  • ${item}`).join('\n');
}
