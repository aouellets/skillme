---
name: Python Async
description: Write correct, non-blocking asyncio code.
---

# Python Async

Use asyncio correctly: concurrency without blocking the event loop.

## Mental model

- One event loop runs many coroutines cooperatively on a single thread.
- `await` yields control; CPU-bound or blocking calls freeze the entire loop.
- Concurrency comes from running tasks, not from awaiting sequentially.

## Running things concurrently

```python
import asyncio

async def main():
    async with asyncio.TaskGroup() as tg:
        tg.create_task(fetch(url1))
        tg.create_task(fetch(url2))
    # both complete here; exceptions propagate as a group

asyncio.run(main())
```

- Prefer `asyncio.TaskGroup` (3.11+) for structured concurrency — it cancels siblings on failure.
- Use `asyncio.gather` when you need the list of results; pass `return_exceptions=True` to collect failures.

## Cancellation

- Cancelling a task raises `CancelledError` at the next await point.
- Never swallow `CancelledError` — re-raise it after cleanup.
- Protect critical cleanup with `try/finally`; use `asyncio.shield` sparingly for must-finish work.
- Add timeouts with `async with asyncio.timeout(5):`.

## Bridging sync and async

- Run blocking/CPU work off the loop: `await asyncio.to_thread(blocking_fn, arg)`.
- For heavy CPU, use a `ProcessPoolExecutor` via `loop.run_in_executor`.
- Call async from sync only at the top level via `asyncio.run`; don't nest event loops.

## Rules

- Never call blocking I/O (requests, time.sleep, sync DB drivers) inside a coroutine — use async libraries or `to_thread`.
- Don't create the loop manually; use `asyncio.run`.
- Keep references to background tasks or they may be garbage-collected mid-flight.
- Use `async with`/`async for` for async context managers and iterators.

## Concurrency control

- Bound parallelism with `asyncio.Semaphore` to avoid overwhelming a service.
- Use an `asyncio.Queue` for producer/consumer pipelines.

## Edge cases

- Fire-and-forget: store the task and add a done callback that logs exceptions.
- Mixing libraries: ensure all I/O libs are async-compatible (aiohttp, asyncpg, httpx).
- Debugging: enable `PYTHONASYNCIODEBUG=1` to catch slow callbacks and un-awaited coroutines.
