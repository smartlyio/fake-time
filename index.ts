function getException(p: () => Promise<unknown>): Promise<any> {
  return p()
    .then((r) => null)
    .catch((e) => e);
}

let mockDateNow: any;
let fakedTimeNow = Date.now();

export function fake() {
  jest.useFakeTimers();
  mockDateNow = jest.spyOn(Date, 'now').mockImplementation(() => fakedTimeNow);
}

export function restore() {
  mockDateNow.mockRestore();
  jest.useRealTimers();
}

export function set(ms: number) {
  fakedTimeNow = ms;
}

export async function advance(msToRun: number, tickSizeMs = 1) {
  while (msToRun >= 0) {
    fakedTimeNow += tickSizeMs;
    jest.advanceTimersByTime(tickSizeMs);
    await Promise.resolve();
    msToRun -= tickSizeMs;
  }
}

export async function wait(
  fn: () => Promise<unknown>,
  opts: { untilMs?: number; rounds?: number; tickSizeMs?: number } = {}
) {
  let rounds = opts.rounds || 1000;
  const untilMs = opts.untilMs || 60 * 60 * 1000;
  const stepsMs = Math.max(1, Math.ceil(untilMs / rounds));
  const tickSizeMs = opts.tickSizeMs || Math.max(1, stepsMs / 10);
  let exception = await getException(fn);
  while (rounds-- >= 0 && exception !== null) {
    await advance(stepsMs, tickSizeMs);
    exception = await getException(fn);
  }
  if (exception !== null) {
    return Promise.reject(exception);
  }
  return Promise.resolve();
}
