---
name: Remotion Setup
description: Scaffolds a new Remotion video project wired for Claude Code Agent Skills — Node check, create-video scaffold, skills install, folder conventions, Google Fonts, and a smoke-test render. Use whenever someone wants to start making videos with Remotion and Claude, even just "make product videos with Claude."
---
# Remotion Setup

You scaffold a fresh **Remotion** project and wire it so the rest of the workflow
is "just prompt Claude." This is the one-time environment work. Do it once per
project; afterward `remotion-compose` and `remotion-render` skip straight to the
creative loop.

Trigger eagerly. If the user says anything about *making videos with Claude* —
"set up Remotion," "create a Remotion project," "I want to make product videos
with Claude," "start a video project" — run this skill.

## Step 1 — Verify the toolchain

Remotion renders with headless Chromium, so check Node before scaffolding:

```bash
node --version   # need >= 16; recommend 18 LTS or 20 LTS
```

If Node is older than 16, stop and tell the user to upgrade (nvm: `nvm install 20 && nvm use 20`).
Also confirm `npx` is available (ships with npm 5.2+).

## Step 2 — Scaffold the project

```bash
npx create-video@latest
```

This is interactive. Recommend the **Blank** (Hello World) template — it is the
cleanest base for product videos. The CLI asks for a project directory and a
package manager; let the user pick, then `cd` into the new folder and install:

```bash
cd <project-name>
npm install
```

## Step 3 — Install the Remotion Agent Skills

So Claude Code has Remotion's own skill context available in this repo:

```bash
npx remotion skills add remotion
```

This drops Remotion's agent-skill files into the project. If the command is
unavailable in the installed Remotion version, point the user at the latest
`@remotion/cli` and continue — it is a convenience, not a hard dependency.

## Step 4 — Establish folder conventions

Standardize the layout so later skills always know where things go:

```
src/
  Root.tsx              # registers every <Composition> (the entry registry)
  index.ts              # registerRoot(RemotionRoot)
  compositions/         # one .tsx file per video — remotion-compose writes here
public/
  assets/               # images, logos, audio — referenced via staticFile()
```

Create the folders if the template did not:

```bash
mkdir -p src/compositions public/assets
```

`src/Root.tsx` is the registry. Every video is a `<Composition>` registered here:

```tsx
// src/Root.tsx
import { Composition } from "remotion";
import { HelloWorld } from "./compositions/HelloWorld";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="HelloWorld"
      component={HelloWorld}
      durationInFrames={90}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

```ts
// src/index.ts
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
```

## Step 5 — Load a Google font

Remotion has first-class Google Fonts so text renders deterministically. Install
and load once:

```bash
npm install @remotion/google-fonts
```

```tsx
// load near the top of a composition file
import { loadFont } from "@remotion/google-fonts/Inter";
const { fontFamily } = loadFont();
// then use: <div style={{ fontFamily }}>...</div>
```

`loadFont()` blocks the render until the font is ready, so on-screen text never
flashes in an unstyled fallback. Pick the font that matches the brand — swap
`Inter` for `Poppins`, `Roboto`, etc.

## Step 6 — Smoke-test composition

Write a trivial composition to prove the environment renders end to end:

```tsx
// src/compositions/HelloWorld.tsx
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont();

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ backgroundColor: "#0B0B0F", justifyContent: "center", alignItems: "center" }}>
      <h1 style={{ fontFamily, color: "white", fontSize: 90, opacity }}>
        It works.
      </h1>
    </AbsoluteFill>
  );
};
```

Make sure it is registered in `src/Root.tsx` (Step 4), then render it:

```bash
npx remotion render src/index.ts HelloWorld out/smoke-test.mp4
```

If `out/smoke-test.mp4` plays a fading-in title, the environment is good. If the
render fails, it is almost always (a) Chromium download/permissions, (b) the
composition not registered in `Root.tsx`, or (c) a Node version issue from Step 1.

## Step 7 — Launch Remotion Studio for preview

For the interactive preview (scrub the timeline, hot-reload on edits):

```bash
npx remotion studio
```

This serves the Studio at **http://localhost:3000**. The `create-video` template
also wires `npm run dev` to the same thing. Leave Studio running while iterating —
edits to composition files hot-reload instantly.

## Handoff

Once the smoke test renders and Studio is up, tell the user the project is ready
and hand off: *"Setup is done. Describe the video you want — duration, scenes,
brand colors — and I'll write the composition (`remotion-compose`), then render
and iterate (`remotion-render`)."*
