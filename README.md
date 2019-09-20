# fake-time

Fake time AND timers in jest.  This here thing aims to solve three(!) problems
 - Jest advanceTimersTo does not change the time Date.now gives out.
 - Jest timer mocks either run the timers once or runs the all timers to 
      exhaustion both of which result in funny if your timers set up new timers
 - Jest timer mocks do not run promises from the promise jobs queue which 
      causes setting new timers from promisy code really annoying.

A working example

```js
// yarn jest examples/working.ts
import * as fakeTime from '../index';

describe('fake-time', () => {
  beforeEach(fakeTime.fake);
  afterAll(fakeTime.restore);

  it('advances time', async () => {
    const start = Date.now();
    await fakeTime.advance(1000);
    expect(Date.now() - start).toBeGreaterThan(1000);
  });

  it('runs promises and new timers from timers', async () => {
    const interval = 10;
    let hits = 0;
    async function set() {
      hits++;
      await Promise.resolve();
      setTimeout(set, interval);
    }
    await set();
    await fakeTime.advance(interval * 10);
    expect(hits).toBeGreaterThan(10);
  });

  describe('wait', () => {
    const dayInMs = 24 * 60 * 50 * 1000;

    it('advances time while waiting', async () => {
      const start = Date.now();
      await fakeTime.wait(async () => expect(Date.now() - start).toBeGreaterThan(dayInMs), {
        untilMs: dayInMs * 2 * 10
      });
    });
  });
});

```
