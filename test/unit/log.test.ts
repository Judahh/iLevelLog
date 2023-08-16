// import { test } from 'jest';
process.env.LOG_LEVEL_0 = 'engine';
process.env.LOG_LEVEL_1 = 'sub_thread_name';
import '../../src/index';

function testLog() {
  console.log('test');
}

test('test log', () => {
  testLog();
});
