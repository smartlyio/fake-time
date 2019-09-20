# fake-time

Fake time AND timers in jest.  This here thing aims to solve two(!) problems
 - Jest advanceTimersTo does not change the time Date.now gives out.
 - Jest timer mocks either run the timers once or runs the all timers to 
      exhaustion both of which result in funny if your timers set up new timers

A working example

```js
>>examples/working.ts
```
