# fake-time

Fake time AND timers in jest.  This here thing aims to solve three(!) problems
 - Jest advanceTimersTo does not change the time Date.now gives out.
 - Jest timer mocks either run the timers once or runs the all timers to 
      exhaustion both of which result in funny if your timers set up new timers
 - Jest timer mocks do not run promises from the promise jobs queue which 
      causes setting new timers from promisy code really annoying.

A working example

```js
>>examples/working.ts
```
