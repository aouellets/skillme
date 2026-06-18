---
name: Rust Patterns
description: Write idiomatic, safe, fast Rust.
---

# Rust Patterns

Write Rust that satisfies the borrow checker and reads cleanly.

## Ownership and borrowing

- Pass `&T` to read, `&mut T` to mutate, take `T` to consume. Default to borrowing.
- One mutable borrow XOR many shared borrows — design APIs so they don't fight this.
- Return owned values from constructors; accept borrows in functions that only read.
- Reach for `Rc`/`Arc` + `RefCell`/`Mutex` only when shared ownership is genuinely needed.

## Lifetimes

- Most lifetimes are elided. Annotate only when the compiler can't infer the relationship.
- Prefer owning data in structs over storing references with lifetimes; it's simpler and avoids self-referential headaches.

## Error handling

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("not found: {0}")]
    NotFound(String),
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

fn load(path: &str) -> Result<String, AppError> {
    Ok(std::fs::read_to_string(path)?)
}
```

- Use `Result` + `?` for recoverable errors; `panic!` only for unrecoverable bugs.
- `thiserror` for libraries (typed errors), `anyhow` for applications (context-rich).
- Avoid `.unwrap()` in production paths; use `?`, `expect` with a reason, or handle the case.

## Idiomatic patterns

- Prefer iterators and combinators (`map`, `filter`, `collect`) over index loops.
- Use `Option`/`Result` combinators (`map`, `and_then`, `ok_or`) instead of nested matches.
- Implement `From` for conversions; derive `Debug`, `Clone`, `PartialEq` where sensible.
- Newtype wrappers for domain types to get type safety for free.

## Performance

- Avoid needless `clone()` — borrow or move. Profile before optimizing.
- Use `&str` over `String`, `&[T]` over `Vec<T>` in function signatures.
- Pre-allocate with `Vec::with_capacity` when the size is known.

## Rules

- Let the type system enforce invariants; make illegal states unrepresentable.
- Keep `unsafe` tiny, justified by a comment, and wrapped in a safe API.
- Run `clippy` and `fmt` in CI.

## Edge cases

- Async: pick one runtime (Tokio); don't block the executor with sync I/O.
- Self-referential structs: use indices or `Pin`, not raw references.
- Trait objects vs generics: generics for performance, `dyn` for heterogeneity.
