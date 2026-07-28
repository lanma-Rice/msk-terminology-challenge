(() => {
  "use strict";

  const data = window.CHALLENGE_DATA;
  const app = document.getElementById("app");

  const state = {
    rounds: data.rounds.map((round) => ({
      ...round,
      questions: shuffle([...round.questions])
    })),
    roundIndex: 0,
    questionIndex: 0,
    oralIndex: 0,
    totalAnswered: 0,
    firstAttemptCorrect: new Map(),
    missedIds: new Set(),
    retryQuestions: [],
    retryIndex: 0,
    retryCorrect: 0,
    oralScores: new Map(),
    recorder: null,
    stream: null,
    chunks: [],
    recordingUrl: null
  };

  const allQuestions = () => state.rounds.flatMap((round) =>
    round.questions.map((question) => ({ ...question, roundId: round.id, roundTitle: round.title, roundLabel: round.label }))
  );

  function shuffle(items) {
    for (let index = items.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
    return items;
  }

  function setScreen(html) {
    cleanupRecorder();
    app.innerHTML = html;
    app.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function headerHtml(eyebrow, title, subtitle = "") {
    return `
      <header class="challenge-header">
        <p class="eyebrow">${eyebrow}</p>
        <h1>${title}</h1>
        ${subtitle ? `<p class="lede">${subtitle}</p>` : ""}
      </header>
    `;
  }

  function progressHtml(current, total, label) {
    const percent = total ? Math.round((current / total) * 100) : 0;
    return `
      <div class="progress-wrap">
        <div class="progress-meta">
          <span>${label}</span>
          <span>${current} of ${total}</span>
        </div>
        <div
          class="progress-track"
          role="progressbar"
          aria-label="${label}"
          aria-valuemin="0"
          aria-valuemax="${total}"
          aria-valuenow="${current}">
          <div class="progress-bar" style="width: ${percent}%"></div>
        </div>
      </div>
    `;
  }

  function showStart() {
    setScreen(`
      ${headerHtml("Ungraded self-check", data.title, data.subtitle)}
      <section class="card hero-card">
        <h2>Four rounds. Immediate feedback. No grade.</h2>
        <p>You will get a hint after your first incorrect choice. After a second incorrect choice, the answer and explanation will appear.</p>

        <ol class="challenge-map" aria-label="Challenge rounds">
          <li><strong>Quick Pick</strong><span>5 recognition questions</span></li>
          <li><strong>Crack the Code</strong><span>5 decoding questions</span></li>
          <li><strong>Make the Call</strong><span>6 scenario questions</span></li>
          <li><strong>SOAP Speak-Back</strong><span>4 private oral practices</span></li>
        </ol>

        <div class="notice">
          <p><strong>Privacy:</strong> Your answers and recordings stay in this browser session. Nothing is submitted to Canvas.</p>
        </div>

        <div class="actions">
          <button class="btn btn-primary" id="start-button" type="button">Start the challenge</button>
        </div>
      </section>
    `);

    document.getElementById("start-button").addEventListener("click", () => {
      state.roundIndex = 0;
      state.questionIndex = 0;
      showRoundIntro();
    });
  }

  function showRoundIntro() {
    const round = state.rounds[state.roundIndex];

    setScreen(`
      ${progressHtml(state.totalAnswered, 16, "Selected-response challenge")}
      <section class="card round-intro">
        <div class="round-number" aria-hidden="true">${round.number}</div>
        <p class="eyebrow">${round.label}</p>
        <h1>${round.title}</h1>
        <p>${round.description}</p>
        <div class="actions" style="justify-content:center">
          <button class="btn btn-primary" id="begin-round" type="button">Begin Round ${round.number}</button>
        </div>
      </section>
    `);

    document.getElementById("begin-round").addEventListener("click", showQuestion);
  }

  function showQuestion({ retry = false } = {}) {
    const round = retry ? null : state.rounds[state.roundIndex];
    const question = retry ? state.retryQuestions[state.retryIndex] : round.questions[state.questionIndex];
    const roundTitle = retry ? question.roundTitle : round.title;
    const roundLabel = retry ? question.roundLabel : round.label;
    const current = retry ? state.retryIndex + 1 : state.totalAnswered + 1;
    const total = retry ? state.retryQuestions.length : 16;

    setScreen(`
      ${progressHtml(retry ? state.retryIndex : state.totalAnswered, total, retry ? "Retry missed questions" : "Selected-response challenge")}
      <section class="card">
        <div class="round-badge">${retry ? "Retry" : roundTitle} · ${roundLabel}</div>
        <p class="question-count">Question ${current} of ${total}</p>
        <div class="prompt" id="question-prompt">${question.prompt}</div>
        <div class="options" id="options" role="group" aria-labelledby="question-prompt"></div>
        <div id="feedback-region" aria-live="polite"></div>
        <div class="actions" id="question-actions"></div>
      </section>
    `);

    const optionsContainer = document.getElementById("options");
    const options = shuffle([...question.options]);
    let attempts = 0;
    let complete = false;

    options.forEach((optionText) => {
      const button = document.createElement("button");
      button.className = "option";
      button.type = "button";
      button.dataset.value = optionText;
      button.innerHTML = optionText;
      button.addEventListener("click", () => {
        if (complete) return;

        attempts += 1;
        const isCorrect = optionText === question.answer;

        if (!retry && attempts === 1) {
          state.firstAttemptCorrect.set(question.id, isCorrect);
          if (!isCorrect) state.missedIds.add(question.id);
        }

        if (isCorrect) {
          complete = true;
          disableOptions(optionsContainer);
          button.classList.add("is-correct");
          if (retry) state.retryCorrect += 1;
          showFeedback(
            "correct",
            attempts === 1 ? "Correct on the first try" : "Correct",
            question.explanation
          );
          showNextButton(retry);
          return;
        }

        button.disabled = true;
        button.classList.add("is-wrong");

        if (attempts === 1) {
          showFeedback("hint", "Try again", question.hint);
        } else {
          complete = true;
          disableOptions(optionsContainer);
          markCorrectOption(optionsContainer, question.answer);
          showFeedback(
            "reveal",
            `Answer: ${question.answer}`,
            question.explanation
          );
          showNextButton(retry);
        }
      });
      optionsContainer.appendChild(button);
    });

    optionsContainer.querySelector("button")?.focus();
  }

  function disableOptions(container) {
    container.querySelectorAll("button").forEach((button) => {
      button.disabled = true;
    });
  }

  function markCorrectOption(container, answer) {
    container.querySelectorAll("button").forEach((button) => {
      if (button.dataset.value === answer) {
        button.classList.add("is-correct");
      }
    });
  }

  function showFeedback(type, heading, body) {
    const region = document.getElementById("feedback-region");
    region.innerHTML = `
      <div class="feedback feedback-${type}">
        <h3>${heading}</h3>
        <p>${body}</p>
      </div>
    `;
  }

  function showNextButton(retry) {
    const actions = document.getElementById("question-actions");
    const isLast = retry
      ? state.retryIndex === state.retryQuestions.length - 1
      : state.roundIndex === state.rounds.length - 1 &&
        state.questionIndex === state.rounds[state.roundIndex].questions.length - 1;

    actions.innerHTML = `
      <button class="btn btn-primary" id="next-question" type="button">
        ${isLast ? (retry ? "Return to results" : "Continue to oral round") : "Next"}
      </button>
    `;

    document.getElementById("next-question").addEventListener("click", () => {
      if (retry) {
        state.retryIndex += 1;
        if (state.retryIndex >= state.retryQuestions.length) {
          showResults(true);
        } else {
          showQuestion({ retry: true });
        }
        return;
      }

      state.totalAnswered += 1;
      state.questionIndex += 1;

      if (state.questionIndex >= state.rounds[state.roundIndex].questions.length) {
        state.roundIndex += 1;
        state.questionIndex = 0;

        if (state.roundIndex >= state.rounds.length) {
          showOralIntro();
        } else {
          showRoundIntro();
        }
      } else {
        showQuestion();
      }
    });
  }

  function showOralIntro() {
    setScreen(`
      ${progressHtml(0, data.oralItems.length, "SOAP Speak-Back")}
      <section class="card round-intro">
        <div class="round-number" aria-hidden="true">4</div>
        <p class="eyebrow">Oral practice</p>
        <h1>SOAP Speak-Back</h1>
        <p>For each SOAP category, listen to the instructor pronounce the term. Then explain it in your own words, listen to yourself, check a model answer, and self-assess.</p>
        <div class="notice" style="text-align:left">
          <p><strong>Recording is private and optional.</strong> Audio is kept only in temporary browser memory. If microphone access is blocked, say your answer aloud and continue with the self-check.</p>
        </div>
        <div class="actions" style="justify-content:center">
          <button class="btn btn-primary" id="begin-oral" type="button">Begin oral practice</button>
        </div>
      </section>
    `);

    document.getElementById("begin-oral").addEventListener("click", () => {
      state.oralIndex = 0;
      showOralItem();
    });
  }

  function showOralItem() {
    const item = data.oralItems[state.oralIndex];

    setScreen(`
      ${progressHtml(state.oralIndex, data.oralItems.length, "SOAP Speak-Back")}
      <section class="card">
        <div class="round-badge">${item.category}</div>
        <p class="question-count">Oral item ${state.oralIndex + 1} of ${data.oralItems.length}</p>

        <div class="term-card">
          <div class="term-name">${item.term}</div>
          <p>${item.prompt}</p>
        </div>

        <section class="audio-block" aria-labelledby="instructor-audio-title">
          <h3 id="instructor-audio-title">1. Listen to the instructor pronunciation</h3>
          <audio id="instructor-audio" controls preload="none">
            <source src="${item.audio}" type="audio/mpeg">
          </audio>
          <p class="status" id="audio-status">Audio filename: <code>${item.audio.split("/").pop()}</code></p>
        </section>

        <section class="recorder-block" aria-labelledby="recorder-title">
          <h3 id="recorder-title">2. Record and listen to your explanation</h3>
          <p class="privacy-note">The recording is not uploaded or saved. It disappears when you leave or refresh this page.</p>
          <div class="actions">
            <button class="btn btn-primary" id="record-start" type="button">Record</button>
            <button class="btn btn-secondary" id="record-stop" type="button" disabled>Stop</button>
            <button class="btn btn-quiet" id="record-delete" type="button" disabled>Delete and retry</button>
          </div>
          <p class="status" id="record-status">Ready to record. You may also speak aloud without using the recorder.</p>
          <div id="student-playback"></div>
        </section>

        <section class="model-block" aria-labelledby="model-title">
          <h3 id="model-title">3. Compare with the model answer</h3>
          <button class="btn btn-secondary" id="reveal-model" type="button">Reveal model answer</button>
          <div id="model-answer"></div>
        </section>

        <section class="rubric-block" id="rubric-block" aria-labelledby="rubric-title" hidden>
          <h3 id="rubric-title">4. Self-assess</h3>
          <fieldset class="checklist">
            <legend class="small-print">Select each statement that is true of your explanation.</legend>
            <label class="check-row"><input type="checkbox" name="rubric"> <span>I explained the term accurately in my own words.</span></label>
            <label class="check-row"><input type="checkbox" name="rubric"> <span>I explained why the term belongs in this SOAP category.</span></label>
            <label class="check-row"><input type="checkbox" name="rubric"> <span>I gave an appropriate example or described how the term might be used.</span></label>
            <label class="check-row"><input type="checkbox" name="rubric"> <span>I spoke clearly enough to understand.</span></label>
          </fieldset>
          <div class="actions">
            <button class="btn btn-secondary" id="check-response" type="button">Check my response</button>
          </div>
          <div id="self-result" aria-live="polite"></div>
          <div class="actions" id="oral-actions"></div>
        </section>
      </section>
    `);

    setupInstructorAudio();
    setupRecorder();
    setupOralReview(item);
  }

  function setupInstructorAudio() {
    const audio = document.getElementById("instructor-audio");
    const status = document.getElementById("audio-status");

    audio.addEventListener("error", () => {
      audio.hidden = true;
      status.setAttribute("role", "alert");
      status.innerHTML = "Instructor pronunciation audio has not been added yet. The activity will work after the correctly named MP3 is uploaded.";
    });

    audio.addEventListener("canplay", () => {
      status.textContent = "Pronunciation audio is ready.";
    }, { once: true });
  }

  function supportedMimeType() {
    if (!window.MediaRecorder) return "";
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/mp4",
      "audio/webm"
    ];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || "";
  }

  function setupRecorder() {
    const startButton = document.getElementById("record-start");
    const stopButton = document.getElementById("record-stop");
    const deleteButton = document.getElementById("record-delete");
    const status = document.getElementById("record-status");

    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      startButton.disabled = true;
      status.setAttribute("role", "alert");
      status.textContent = "This browser does not support in-page audio recording. Say your response aloud, then continue to the model answer and self-check.";
      return;
    }

    startButton.addEventListener("click", async () => {
      try {
        cleanupRecorder();
        state.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = supportedMimeType();
        state.chunks = [];
        state.recorder = mimeType
          ? new MediaRecorder(state.stream, { mimeType })
          : new MediaRecorder(state.stream);

        state.recorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0) state.chunks.push(event.data);
        });

        state.recorder.addEventListener("stop", () => {
          const blobType = state.recorder?.mimeType || "audio/webm";
          const blob = new Blob(state.chunks, { type: blobType });
          state.recordingUrl = URL.createObjectURL(blob);
          document.getElementById("student-playback").innerHTML = `
            <p><strong>Your recording:</strong></p>
            <audio controls src="${state.recordingUrl}"></audio>
          `;
          status.textContent = "Recording ready. Listen to it, then reveal the model answer.";
          startButton.disabled = false;
          stopButton.disabled = true;
          deleteButton.disabled = false;
          stopTracks();
        });

        state.recorder.start();
        status.textContent = "Recording…";
        startButton.disabled = true;
        stopButton.disabled = false;
        deleteButton.disabled = true;
      } catch (error) {
        status.setAttribute("role", "alert");
        status.textContent = "Microphone access was unavailable. Open the activity in a new window or say your answer aloud without recording.";
        startButton.disabled = false;
        stopButton.disabled = true;
      }
    });

    stopButton.addEventListener("click", () => {
      if (state.recorder?.state === "recording") {
        state.recorder.stop();
      }
    });

    deleteButton.addEventListener("click", () => {
      clearRecordingPlayback();
      status.textContent = "Recording deleted. You can try again.";
      deleteButton.disabled = true;
    });
  }

  function setupOralReview(item) {
    const revealButton = document.getElementById("reveal-model");
    const modelContainer = document.getElementById("model-answer");
    const rubricBlock = document.getElementById("rubric-block");

    revealButton.addEventListener("click", () => {
      modelContainer.innerHTML = `<div class="model-answer"><p>${item.model}</p></div>`;
      revealButton.disabled = true;
      rubricBlock.hidden = false;

      document.getElementById("check-response").addEventListener("click", () => {
        const checked = rubricBlock.querySelectorAll('input[name="rubric"]:checked').length;
        state.oralScores.set(item.id, checked);

        let message = "";
        if (checked >= 3) {
          message = "<strong>Ready:</strong> Your explanation includes most or all of the target elements.";
        } else if (checked === 2) {
          message = "<strong>Review:</strong> Compare your explanation with the model and consider recording it again.";
        } else {
          message = "<strong>Retry recommended:</strong> Review the model answer and explain the term again before continuing.";
        }

        document.getElementById("self-result").innerHTML = `<div class="self-result">${message}</div>`;
        document.getElementById("oral-actions").innerHTML = `
          <button class="btn btn-primary" id="continue-oral" type="button">
            ${state.oralIndex === data.oralItems.length - 1 ? "View results" : "Next oral item"}
          </button>
        `;

        document.getElementById("continue-oral").addEventListener("click", () => {
          state.oralIndex += 1;
          if (state.oralIndex >= data.oralItems.length) {
            showResults(false);
          } else {
            showOralItem();
          }
        });
      });
    });
  }

  function breakdownFor(round) {
    const correct = round.questions.filter((question) => state.firstAttemptCorrect.get(question.id) === true).length;
    return { correct, total: round.questions.length };
  }

  function showResults(afterRetry = false) {
    const total = 16;
    const firstTryScore = [...state.firstAttemptCorrect.values()].filter(Boolean).length;
    const missedCount = state.missedIds.size;
    const oralCompleted = state.oralScores.size;

    const breakdownCards = state.rounds.map((round) => {
      const result = breakdownFor(round);
      return `
        <div class="summary-card">
          <strong>${round.title}: ${result.correct}/${result.total}</strong>
          <span>${round.label} · correct on first attempt</span>
        </div>
      `;
    }).join("");

    setScreen(`
      ${headerHtml("Challenge complete", "Your results", "Use this summary to decide what you want to review. Nothing has been submitted or graded.")}
      <section class="card">
        <p class="eyebrow">First-attempt performance</p>
        <div class="big-score">${firstTryScore}/${total}</div>
        <p>${firstTryScore === total
          ? "You answered every selected-response item correctly on the first try."
          : `You answered ${firstTryScore} of ${total} selected-response items correctly on the first try.`}</p>

        <div class="summary-grid">${breakdownCards}</div>

        <div class="notice">
          <p><strong>Oral practice:</strong> ${oralCompleted} of ${data.oralItems.length} items self-assessed.</p>
        </div>

        ${afterRetry ? `
          <p><strong>Retry completed:</strong> You answered ${state.retryCorrect} of ${state.retryQuestions.length} retry items correctly.</p>
        ` : ""}

        <div class="actions">
          ${missedCount > 0 && !afterRetry ? `<button class="btn btn-primary" id="retry-missed" type="button">Retry ${missedCount} missed ${missedCount === 1 ? "question" : "questions"}</button>` : ""}
          <button class="btn btn-secondary" id="restart" type="button">Restart the full challenge</button>
        </div>

        <p class="small-print">A “missed” question is one that was not answered correctly on the first attempt. The retry does not change the first-attempt summary.</p>
      </section>
    `);

    document.getElementById("restart").addEventListener("click", resetChallenge);

    const retryButton = document.getElementById("retry-missed");
    if (retryButton) {
      retryButton.addEventListener("click", () => {
        state.retryQuestions = allQuestions().filter((question) => state.missedIds.has(question.id));
        state.retryIndex = 0;
        state.retryCorrect = 0;
        showRetryIntro();
      });
    }
  }

  function showRetryIntro() {
    setScreen(`
      <section class="card round-intro">
        <div class="round-number" aria-hidden="true">↻</div>
        <p class="eyebrow">Optional review</p>
        <h1>Retry missed questions</h1>
        <p>You will see only the questions that were not correct on your first attempt. They will still appear one at a time with hints and explanations.</p>
        <div class="actions" style="justify-content:center">
          <button class="btn btn-primary" id="begin-retry" type="button">Begin retry</button>
        </div>
      </section>
    `);

    document.getElementById("begin-retry").addEventListener("click", () => showQuestion({ retry: true }));
  }

  function clearRecordingPlayback() {
    if (state.recordingUrl) {
      URL.revokeObjectURL(state.recordingUrl);
      state.recordingUrl = null;
    }
    const playback = document.getElementById("student-playback");
    if (playback) playback.innerHTML = "";
  }

  function stopTracks() {
    if (state.stream) {
      state.stream.getTracks().forEach((track) => track.stop());
      state.stream = null;
    }
  }

  function cleanupRecorder() {
    try {
      if (state.recorder?.state === "recording") {
        state.recorder.stop();
      }
    } catch (_) {
      // Ignore cleanup errors.
    }
    stopTracks();
    clearRecordingPlayback();
    state.recorder = null;
    state.chunks = [];
  }

  function resetChallenge() {
    cleanupRecorder();
    state.rounds = data.rounds.map((round) => ({
      ...round,
      questions: shuffle([...round.questions])
    }));
    state.roundIndex = 0;
    state.questionIndex = 0;
    state.oralIndex = 0;
    state.totalAnswered = 0;
    state.firstAttemptCorrect.clear();
    state.missedIds.clear();
    state.retryQuestions = [];
    state.retryIndex = 0;
    state.retryCorrect = 0;
    state.oralScores.clear();
    showStart();
  }

  window.addEventListener("beforeunload", cleanupRecorder);
  showStart();
})();
