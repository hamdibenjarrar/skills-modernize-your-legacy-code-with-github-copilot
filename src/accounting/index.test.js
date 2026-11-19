// Unit tests that mirror docs/TESTPLAN.md.
// Author: Hamdi Ben Jarrar. License: MIT.

const test = require('node:test');
const assert = require('node:assert');
const { PassThrough } = require('stream');
const { Operations, DataStore, formatAmount, main } = require('./index');

test('TC-01 starting balance is 1000.00', () => {
  const ops = new Operations();
  assert.strictEqual(formatAmount(ops.total()), '1000.00');
});

test('TC-02 credit a valid amount', () => {
  const ops = new Operations();
  assert.strictEqual(ops.credit(250).balance, 1250);
});

test('TC-03 credit then view the balance', () => {
  const ops = new Operations();
  ops.credit(100);
  assert.strictEqual(ops.total(), 1100);
});

test('TC-04 debit a valid amount', () => {
  const ops = new Operations();
  const result = ops.debit(400);
  assert.ok(result.success);
  assert.strictEqual(result.balance, 600);
});

test('TC-05 debit the full balance', () => {
  const ops = new Operations();
  assert.strictEqual(ops.debit(1000).balance, 0);
});

test('TC-06 debit more than the balance is refused', () => {
  const ops = new Operations();
  const result = ops.debit(1500);
  assert.strictEqual(result.success, false);
  assert.strictEqual(ops.total(), 1000);
});

test('TC-07 credit a zero amount', () => {
  const ops = new Operations();
  ops.credit(0);
  assert.strictEqual(ops.total(), 1000);
});

test('TC-08 several operations in a row', () => {
  const ops = new Operations(new DataStore());
  ops.credit(200);
  ops.debit(50);
  assert.strictEqual(formatAmount(ops.total()), '1150.00');
});

async function runMenu(lines) {
  const input = new PassThrough();
  const output = new PassThrough();
  let text = '';
  output.on('data', (chunk) => { text += chunk.toString(); });
  const done = main(input, output);
  input.end(lines.join('\n') + '\n');
  await done;
  return text;
}

test('TC-09 invalid menu choice', async () => {
  const text = await runMenu(['5', '4']);
  assert.match(text, /Invalid choice, please select 1-4\./);
});

test('TC-10 exit the application', async () => {
  const text = await runMenu(['4']);
  assert.match(text, /Exiting the program\. Goodbye!/);
});
