---
name: readable-code
description: Write and review code for readability, based on the principles of リーダブルコード (The Art of Readable Code). Use when writing, refactoring, or reviewing code and the goal is clarity: naming, comments, control flow, splitting long expressions, extracting functions, simplifying logic, or making code easier for others to understand.
---

# Readable Code

Core idea: **code should minimize the time it takes someone else to understand it.**
Fewer lines is not the goal. Understanding speed is.

When reviewing or writing, check the four areas below in order. Give concrete
rewrites, not general advice.

## 1. Surface-level: names, comments, formatting

**Names**
- Pack information into the name: a specific verb (`fetch`/`download` over `get`), a unit (`delay_ms`, `size_mb`), an attribute (`raw_password`, `escaped_html`).
- Avoid vague names (`tmp`, `data`, `result`, `val`) unless the scope is tiny and the meaning obvious.
- Loop indexes: `i, j` are fine only in short loops; otherwise name them by what they index (`user_i`, `club_i`).
- Name length tracks scope size: short scope, short name; wide scope, descriptive name.
- Avoid ambiguous words: `filter` (keep or drop?), `limit` (min or max?). Prefer `max_`/`min_`, `first`/`last`, `begin`/`end`.
- Booleans read as questions: `is_`, `has_`, `can_`, `should_`. Avoid negated names (`disable_ssl`); prefer positive ones (`use_ssl`).
- Beware names that are easily misread; a reader's first guess should be correct.

**Formatting**
- Consistent layout and indentation; align parallel lines so differences stand out.
- Group related lines into paragraphs separated by blank lines; order declarations meaningfully, and keep that order everywhere.
- Follow the project's existing style over personal taste.

**Comments**
- Do not comment what the code already says. Do not comment bad names; fix the names.
- Do comment: the *why* behind a decision, known flaws (`TODO`, `HACK`), constants (why this value), surprising behavior, and a short summary of a dense block.
- State the intent at the level of the goal, not line by line. Use concrete examples for tricky I/O.
- Think of the reader's likely questions and answer them; put yourself in their shoes.

## 2. Loops and logic

- Put the changing/subject operand on the left, the stable one on the right (`if (length > 10)`, not `if (10 < length)`).
- Order `if/else` blocks: positive condition first, simpler case first, and the interesting or suspicious case first.
- Avoid the ternary operator unless it fits cleanly on one line; otherwise use `if/else`.
- Avoid `do/while`; avoid deeply nested code. Return early to flatten nesting (guard clauses).
- Avoid `goto` and jumping control flow where a plain structure works.
- Minimize nesting: invert the condition, exit early, and pull inner blocks into functions.

## 3. Breaking down big expressions

- **Explaining variables**: name a sub-expression to document it.
- **Summary variables**: give a name to a long condition or repeated expression.
- **De Morgan's laws**: rewrite `!(a && b)` as `!a || !b` when it reads better.
- Do not abuse short-circuit logic for cleverness; if it takes effort to parse, split it.
- Break complex logic into simpler pieces, then reassemble.
- Reduce the number of variables, shrink their scope, and prefer write-once variables (`const`/`final`). Mutable state that changes in many places is hard to reason about.
- Move declarations next to their first use.

## 4. Reorganizing code

- **Extract unrelated subproblems** into their own functions: anything not tied to the main goal of the current function.
- One task at a time: if a function does several things, list the tasks and split them.
- Turn thoughts into code: explain the logic in plain words, then make the code match that explanation.
- Don't build features you aren't going to need; keep the codebase small. Remove dead code. Know the standard library.
- Prefer simple interfaces: choose the simplest API that does the job and hides complexity from callers.

## Testing for readability

- Tests are also code to be read. Keep each test small and focused; make the failure message tell you what went wrong.
- Name tests by scenario and expectation.
- Hide setup noise in helpers, and keep the assertion visible in the test.
- Test inputs should be simple but cover the corners.

## How to apply

1. Read the code as a newcomer would; note the first place you stumble.
2. Fix the biggest stumbling block first: usually a name, a nested block, or a long expression.
3. Show a before/after and say which principle the change follows.
4. Keep behavior identical; do not mix readability edits with logic changes.
5. If a style rule conflicts with the project's established conventions, follow the project.
