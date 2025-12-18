/**
 * Quiz Rendering Utilities
 * Generates HTML strings matching shared quiz CSS classes
 */

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/**
 * Renders a single option as HTML string
 */
export function renderOption(
  text: string,
  index: number,
  state: "default" | "selected" | "correct" | "incorrect" = "default"
): string {
  const key = String.fromCharCode(65 + index); // A, B, C, D
  const stateClass = state !== "default" ? ` ${state}` : "";

  return `
    <button class="quiz-option${stateClass}" data-index="${index}">
      <span class="quiz-option-key">${key}</span>
      <span class="quiz-option-text">${text}</span>
    </button>
  `;
}

/**
 * Renders all options for a question
 */
export function renderOptions(
  options: string[],
  selectedIndex: number | null = null
): string {
  return `
    <div class="quiz-options">
      ${options
        .map((opt, i) =>
          renderOption(opt, i, selectedIndex === i ? "selected" : "default")
        )
        .join("")}
    </div>
  `;
}

/**
 * Renders a complete question card
 */
export function renderQuestionCard(
  question: QuizQuestion,
  selectedIndex: number | null = null
): string {
  return `
    <div class="quiz-question-text">${question.question}</div>
    ${renderOptions(question.options, selectedIndex)}
  `;
}

/**
 * Strips HTML tags from a string
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

/**
 * Renders a result item (for review after submission)
 */
export function renderResultItem(
  question: QuizQuestion,
  index: number,
  userAnswer: number | null
): string {
  const isCorrect = userAnswer === question.correctIndex;
  const userAnswerText =
    userAnswer !== null ? question.options[userAnswer] : "Not answered";
  const correctAnswerText = question.options[question.correctIndex];

  // Strip HTML for preview
  const preview = stripHtml(question.question).slice(0, 50);

  return `
    <details class="quiz-result-item ${isCorrect ? "correct" : "incorrect"}">
      <summary>
        <span class="quiz-result-icon">${isCorrect ? "✓" : "✗"}</span>
        <span class="quiz-result-q">Q${index + 1}</span>
        <span class="quiz-result-preview">${preview}${preview.length >= 50 ? "..." : ""}</span>
      </summary>
      <div class="quiz-result-detail">
        <div class="quiz-result-question">${question.question}</div>
        ${
          !isCorrect
            ? `
          <div class="quiz-result-answers">
            <div class="quiz-result-your-answer">Your answer: ${userAnswerText}</div>
            <div class="quiz-result-correct-answer">Correct: ${correctAnswerText}</div>
          </div>
        `
            : ""
        }
        <div class="quiz-result-explanation">${question.explanation}</div>
      </div>
    </details>
  `;
}
