# Musculoskeletal Terminology Challenge

An ungraded, immediate-feedback activity designed for embedding in a Canvas page.

## What is included

- **Round 1: Quick Pick** — 5 recognition questions
- **Round 2: Crack the Code** — 5 questions that decode an underlined term
- **Round 3: Make the Call** — 6 scenario-based application questions
- **Round 4: SOAP Speak-Back** — 4 private oral-practice items
- One question or oral prompt per screen
- A hint after the first incorrect response
- The correct answer and explanation after a second incorrect response
- Results by question format
- Optional retry of questions missed on the first attempt
- No grade, login, database, analytics, or student-data collection

## Files

```text
msk-terminology-challenge/
├── index.html
├── styles.css
├── questions.js
├── app.js
├── canvas-embed.html
├── .nojekyll
└── assets/
    └── audio/
        └── README.md
```

## Add the instructor pronunciation files

Place these four MP3 files in `assets/audio/`:

```text
subjective-crepitus.mp3
objective-spiral-fracture.mp3
assessment-subluxation.mp3
plan-closed-reduction.mp3
```

Until the files are added, the activity displays a clear placeholder message and the rest of the challenge still works.

## Publish with GitHub Pages

1. Unzip the package.
2. Sign in to GitHub and create a new repository. A suggested repository name is:
   `msk-terminology-challenge`
3. Upload **the contents of this folder**, preserving the `assets/audio/` folder structure.
4. Commit the files to the `main` branch.
5. Open the repository’s **Settings**.
6. Select **Pages**.
7. Under **Build and deployment**, choose **Deploy from a branch**.
8. Select:
   - Branch: `main`
   - Folder: `/ (root)`
9. Save and wait for the published URL to appear.

For a project repository, the URL is normally:

```text
https://YOUR-GITHUB-USERNAME.github.io/msk-terminology-challenge/
```

If you use a different repository name, replace the final part of the URL.

## Add the audio files later

1. Open the repository.
2. Navigate to `assets/audio/`.
3. Choose **Add file → Upload files**.
4. Upload the four correctly named MP3 files.
5. Commit the change.
6. Wait briefly for GitHub Pages to redeploy, then refresh the activity.

## Embed in Canvas

Open `canvas-embed.html`, replace both instances of the sample GitHub Pages URL, and paste the code into the Canvas page’s HTML editor.

The iframe includes:

```html
allow="microphone"
```

That permission is needed for browser recording inside the embedded activity.

A new-window link is also included. It is the fallback when a browser or Canvas configuration blocks microphone access inside the iframe.

## Important limitations

- Canvas does not receive a score or completion record from this basic iframe.
- Student recordings are held only in temporary browser memory.
- Recordings disappear when the activity is refreshed or closed.
- GitHub Pages content is accessible to anyone who has the published URL.
- Do not place confidential course data, student information, assessment keys for secure exams, or API keys in this repository.

## Editing questions

Open `questions.js`. Each question contains:

- `prompt`
- `options`
- `answer`
- `hint`
- `explanation`

The oral-practice items are located near the bottom under `oralItems`.

Keep the answer text exactly identical to one of the option values.

## Testing checklist

Test both the direct GitHub Pages link and the Canvas iframe:

- Desktop Chrome, Safari, or Edge
- Mobile-sized browser window
- Keyboard-only navigation
- Screen-reader headings and button labels
- First incorrect answer shows a hint
- Second incorrect answer reveals the answer
- Correct answer advances only after the student selects Next
- Retry includes only first-attempt misses
- Instructor audio plays
- Microphone permission appears
- Record, stop, listen, delete, and retry work
- New-window fallback works
