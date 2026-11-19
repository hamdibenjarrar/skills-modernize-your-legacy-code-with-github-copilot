// Student Account Management System, converted from the COBOL programs in src/cobol.
// Author: Hamdi Ben Jarrar. License: MIT.

const readline = require('readline');

const INITIAL_BALANCE = 1000.0;

// DataProgram (data.cob): stores the balance in memory.
class DataStore {
  constructor(initialBalance = INITIAL_BALANCE) {
    this.balance = initialBalance;
  }

  read() {
    return this.balance;
  }

  write(balance) {
    this.balance = balance;
  }
}

// Amounts are handled in cents to avoid rounding errors.
function toCents(amount) {
  return Math.round(Number(amount) * 100);
}

function fromCents(cents) {
  return cents / 100;
}

function formatAmount(amount) {
  return Number(amount).toFixed(2);
}

function parseAmount(input) {
  const value = Number(String(input).trim());
  if (!Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}

// Operations (operations.cob): view, credit and debit logic.
class Operations {
  constructor(store = new DataStore()) {
    this.store = store;
  }

  total() {
    return this.store.read();
  }

  credit(amount) {
    const newBalance = fromCents(toCents(this.store.read()) + toCents(amount));
    this.store.write(newBalance);
    return { success: true, balance: newBalance };
  }

  debit(amount) {
    const current = this.store.read();
    if (toCents(current) >= toCents(amount)) {
      const newBalance = fromCents(toCents(current) - toCents(amount));
      this.store.write(newBalance);
      return { success: true, balance: newBalance };
    }
    return { success: false, balance: current };
  }
}

// MainProgram (main.cob): menu loop.
function menuText() {
  return [
    '--------------------------------',
    'Account Management System',
    '1. View Balance',
    '2. Credit Account',
    '3. Debit Account',
    '4. Exit',
    '--------------------------------',
  ].join('\n');
}

async function main(input = process.stdin, output = process.stdout) {
  const rl = readline.createInterface({ input, terminal: false });
  const lines = rl[Symbol.asyncIterator]();
  const ask = async (question) => {
    output.write(question);
    const next = await lines.next();
    // When the input ends, behave like choosing Exit.
    return next.done ? '4' : next.value;
  };
  const ops = new Operations();
  let running = true;

  while (running) {
    output.write(menuText() + '\n');
    const choice = (await ask('Enter your choice (1-4): ')).trim();

    switch (choice) {
      case '1':
        output.write(`Current balance: ${formatAmount(ops.total())}\n`);
        break;
      case '2': {
        const amount = parseAmount(await ask('Enter credit amount: '));
        if (amount === null) {
          output.write('Invalid amount.\n');
          break;
        }
        const result = ops.credit(amount);
        output.write(`Amount credited. New balance: ${formatAmount(result.balance)}\n`);
        break;
      }
      case '3': {
        const amount = parseAmount(await ask('Enter debit amount: '));
        if (amount === null) {
          output.write('Invalid amount.\n');
          break;
        }
        const result = ops.debit(amount);
        if (result.success) {
          output.write(`Amount debited. New balance: ${formatAmount(result.balance)}\n`);
        } else {
          output.write('Insufficient funds for this debit.\n');
        }
        break;
      }
      case '4':
        running = false;
        break;
      default:
        output.write('Invalid choice, please select 1-4.\n');
    }
  }

  output.write('Exiting the program. Goodbye!\n');
  rl.close();
}

if (require.main === module) {
  main();
}

module.exports = { DataStore, Operations, INITIAL_BALANCE, formatAmount, parseAmount, menuText, main };
