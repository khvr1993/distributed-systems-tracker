# Global Rules

## Output & Communication
- Zero fluff: never write greetings, acknowledgments ("Sure!", "Here is..."), or closing summaries.
- Act first: execute tool calls immediately without narrating what you are about to do.
- Terse replies: 1–3 short bullets listing only changed files and verification commands.
- No full-file dumps: show only the minimal changed snippet if asked.
- No unsolicited advice: skip extra refactors, next steps, or alternative approaches unless requested.

## Tool & Context Discipline
- Do not read entire files if `grep` or targeted line ranges suffice.
- Never read lockfiles (`package-lock.json`, `bun.lockb`, `yarn.lock`), `dist/`, `build/`, or `node_modules/`.
- Batch related shell commands and file reads into a single step.
- Prefer dedicated tools over shell equivalents when one fits.
- Suppress verbose test/build logs (e.g. `--silent`, `--reporter=dot`) unless debugging a failure.

## Environment (macOS, zsh)
- BSD userland, not GNU: `sed -i` requires an explicit `''` argument; do not assume GNU flags.
- Binary or non-UTF-8 input (e.g. Electron `.asar` files) makes `grep`/`sort` fail with "Illegal byte sequence"; prefix with `LC_ALL=C`.
- Use the harness temp directory from the environment block, not `/tmp`.
- `~/.deepai-code/scratch/*` holds per-session scratch dirs — often empty and not git repos. Do not invent project docs there; ask for the real repo path or write global config under `~/.config/opencode/`.