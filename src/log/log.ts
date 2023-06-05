// import chalk from 'chalk';
import JSONL from 'jsonl-parse-stringify';
import { Warning } from '../exception/warning';
export {};

const oldConsole = { ...console };

declare global {
  interface Console {
    trace(tabularData?: any, properties?: string[], type?: string): void;
    printException(
      e: unknown | Error | Warning,
      functionInfo?: { name?: string; params?: unknown[] },
      message?: any,
      ...optionalParams: any[]
    ): void;
  }
}

const consoleFunction = {
  L: oldConsole.log,
  I: oldConsole.info,
  W: oldConsole.warn,
  E: oldConsole.error,
  D: oldConsole.debug,
  T: oldConsole.trace,
};

const consoleLevel = {
  L: 'LOG',
  I: 'INFO',
  W: 'WARN',
  E: 'ERROR',
  D: 'DEBUG',
  T: 'TRACE',
};

const consoleLevelValue = {
  L: 0,
  I: 1,
  W: 2,
  E: 3,
  D: 4,
  T: 5,
};

const alwaysLogString = process.env.LOG_USE_ALWAYS_LOG
  ? process.env.LOG_USE_ALWAYS_LOG
  : 'false';

let alwaysLog = false;

try {
  alwaysLog = JSON.parse(alwaysLogString);
} catch (error) {
  alwaysLog = false;
}

const prefix = (type: string) => {
  const date = new Date();
  const time = date.toLocaleString(process.env.LOG_DATE_LOCALE || 'pt-BR');
  return (
    `[${time}] [${type}] [${self?.name || 'main'}]` +
    (self?.['level0'] ? ` [${self?.['level0']}]` : '') +
    (self?.['level1'] ? ` [${self?.['level1']}]` : '') +
    (self?.['level2'] ? ` [${self?.['level2']}]` : '') +
    (self?.['level3'] ? ` [${self?.['level3']}]` : '') +
    (self?.['level4'] ? ` [${self?.['level4']}]` : '') +
    (self?.['level5'] ? ` [${self?.['level5']}]` : '')
  );
};

const format = (...messages: any[]) => {
  const seen = new WeakSet();
  const sMessages = messages.map((m) =>
    JSON.stringify(
      m,
      (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return;
          }
          seen.add(value);
        }
        return value;
      },
      2
    )
  );
  const lines = sMessages.map((m) => m?.split('\n')).flat();
  let hasNewLine = sMessages.some((m) => m?.includes('\n'));
  let longestMessageLine =
    lines?.reduce((a, b) => (a?.length > b?.length ? a : b))?.length || 0;

  longestMessageLine = longestMessageLine < 25 ? 25 : longestMessageLine; //80 ?

  if (
    messages?.length > 1 &&
    (messages?.[0] == '\n' || messages?.[lines?.length - 1] == '\n')
  ) {
    if (messages?.[0] == '\n') {
      messages.shift();
      hasNewLine = true;
    } else if (messages?.[lines?.length - 1] == '\n') {
      messages.pop();
      hasNewLine = true;
    }
  }

  const divider = '-'.repeat(longestMessageLine);
  if (hasNewLine) {
    return ['\n', divider, '\n', ...messages, '\n', divider];
  }
  return messages;
};

const fullLog = (type: string, message?: any, ...optionalParams: any[]) => {
  const prod = process.env.LOG_ENV?.toLowerCase().includes('prod');
  const p = (type || 'log').toUpperCase()[0];
  if (prod) {
    const elements = [message, ...optionalParams];
    const strings = elements.filter(
      (e) => typeof e !== 'object' && typeof e !== 'function'
    );
    let objects = elements
      .filter((e) => typeof e === 'object')
      .map((e) => {
        const n = { ...e, stack: e.stack };
        if (!n?.stack) {
          delete n.stack;
        }
        return n;
      });
    const traces = objects.filter((e) => e?.stack);
    objects = objects.filter((e) => !e?.stack);
    const functions = elements
      .filter((e) => typeof e === 'function')
      .map((e) => e.toString());
    const log = {
      '@timestamp': new Date().toISOString(),
      '@version': '1',
      thread_name: self?.name || 'main',
      level: consoleLevel[p],
      level_value: consoleLevelValue[p],
      logger_name: process.env.npm_package_name,
      messages: strings,
      traces,
      objects,
      functions,
    };
    log[process.env.LOG_LEVEL_0 || 'level0'] = self?.['level0'];
    log[process.env.LOG_LEVEL_1 || 'level1'] = self?.['level1'];
    log[process.env.LOG_LEVEL_2 || 'level2'] = self?.['level2'];
    log[process.env.LOG_LEVEL_3 || 'level3'] = self?.['level3'];
    log[process.env.LOG_LEVEL_4 || 'level4'] = self?.['level4'];
    log[process.env.LOG_LEVEL_5 || 'level5'] = self?.['level5'];
    for (const key in log) {
      if (Object.prototype.hasOwnProperty.call(log, key)) {
        if (!log[key]) delete log[key];
      }
    }
    return [JSONL.stringify([log])];
  }
  return [prefix(type), ...format(message, ...optionalParams)];
};

const log = (message?: any, ...optionalParams: any[]) => {
  oldConsole.log(...fullLog('L', message, ...optionalParams));
};

const info = (message?: any, ...optionalParams: any[]) => {
  if (alwaysLog) oldConsole.log(...fullLog('I', message, ...optionalParams));
  else
    oldConsole.info(
      // chalk.blue(
      ...fullLog('I', message, ...optionalParams)
      // )
    );
};

const warn = (message?: any, ...optionalParams: any[]) => {
  if (alwaysLog) oldConsole.log(...fullLog('W', message, ...optionalParams));
  else
    oldConsole.warn(
      // chalk.yellow(
      ...fullLog('W', message, ...optionalParams)
      // )
    );
};

const error = (message?: any, ...optionalParams: any[]) => {
  if (alwaysLog) oldConsole.log(...fullLog('E', message, ...optionalParams));
  else
    oldConsole.error(
      // chalk.red(
      ...fullLog('E', message, ...optionalParams)
      // )
    );
};

const debug = (message?: any, ...optionalParams: any[]) => {
  if (alwaysLog) oldConsole.log(...fullLog('D', message, ...optionalParams));
  else
    oldConsole.debug(
      // chalk.yellow(
      ...fullLog('D', message, ...optionalParams)
      // )
    );
};

const trace = (message?: any, ...optionalParams: any[]) => {
  if (alwaysLog) oldConsole.log(...fullLog('T', message, ...optionalParams));
  else
    oldConsole.trace(
      // chalk.yellow(
      ...fullLog('T', message, ...optionalParams)
      // )
    );
};

const table = (tabularData?: any, properties?: string[], type = 'log') => {
  type = (type || 'log').toUpperCase()[0];
  const p = prefix(type);
  consoleFunction[type](p);
  oldConsole.table(tabularData, properties);
};

const printException = (
  e: unknown | Error | Warning,
  functionInfo?: { name?: string; params?: unknown[] },
  message?: any,
  ...optionalParams: any[]
) => {
  message = message || '';
  const elements = [message, ...(optionalParams || [])];
  if ((e as Warning).isWarning) {
    warn(...elements, functionInfo, e);
  } else {
    error(...elements, functionInfo, e);
  }
};

// eslint-disable-next-line no-global-assign
console = {
  ...oldConsole,
  log,
  info,
  warn,
  error,
  debug,
  trace,
  table,
  printException,
} as Console;
