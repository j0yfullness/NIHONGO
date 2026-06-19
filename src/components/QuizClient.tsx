"use client";

import { useState, useCallback } from "react";

interface Question {
  id: string;
  text: string;
  type: "MULTIPLE_CHOICE" | "FILL_BLANK";
  options: string[];
  correctAnswer: string;
}

interface QuizClientProps {
  questions: Question[];
  title: string;
  quizId: string;
  lessonId?: string;
}

export default function QuizClient({ questions, title, quizId, lessonId }: QuizClientProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((q) => answers[q.id]?.trim());

  const handleSubmit = useCallback(async () => {
    setSubmitted(true);

    const total = questions.length;
    const correct = questions.filter(
      (q) => answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
    ).length;
    const passed = correct >= total * 0.7;

    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quizId,
        lessonId,
        score: correct,
        passed,
        completed: true,
      }),
    });
  }, [questions, answers, quizId, lessonId]);

  const handleRetry = useCallback(() => {
    setAnswers({});
    setSubmitted(false);
  }, []);

  const score = submitted
    ? questions.filter((q) => answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()).length
    : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">{title}</h2>
        <span className="text-sm text-zinc-500">{questions.length} questions</span>
      </div>

      <div className="space-y-6">
        {questions.map((q, i) => {
          const isCorrect =
            submitted && answers[q.id]?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

          return (
            <div
              key={q.id}
              className={`rounded-xl border p-5 ${
                submitted
                  ? isCorrect
                    ? "border-green-400 bg-green-50 dark:bg-green-950/20"
                    : "border-red-400 bg-red-50 dark:bg-red-950/20"
                  : "border-zinc-200 dark:border-zinc-700"
              }`}
            >
              <div className="flex gap-3 mb-3">
                <span className="text-sm font-medium text-zinc-400 mt-0.5 shrink-0">Q{i + 1}</span>
                <p className="font-medium">{q.text}</p>
              </div>

              {q.type === "MULTIPLE_CHOICE" && q.options.length > 0 ? (
                <div className="ml-8 space-y-2">
                  {q.options.map((opt, oi) => (
                    <label
                      key={oi}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        submitted
                          ? opt === q.correctAnswer
                            ? "bg-green-100 dark:bg-green-900/30 ring-2 ring-green-400"
                            : answers[q.id] === opt
                            ? "bg-red-100 dark:bg-red-900/30 ring-2 ring-red-400"
                            : "bg-zinc-50 dark:bg-zinc-800/30"
                          : answers[q.id] === opt
                          ? "bg-blue-50 dark:bg-blue-900/30 ring-2 ring-blue-400"
                          : "bg-zinc-50 dark:bg-zinc-800/30 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
                        disabled={submitted}
                        className="sr-only"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="ml-8">
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    value={answers[q.id] || ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    disabled={submitted}
                    className={`w-full p-3 rounded-lg border text-sm focus:outline-none focus:ring-2 ${
                      submitted
                        ? isCorrect
                          ? "border-green-400 ring-1 ring-green-400 bg-green-50 dark:bg-green-950/20"
                          : "border-red-400 ring-1 ring-red-400 bg-red-50 dark:bg-red-950/20"
                        : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/30 focus:ring-blue-400"
                    }`}
                  />
                </div>
              )}

              {submitted && !isCorrect && (
                <p className="ml-8 mt-2 text-sm text-red-600 dark:text-red-400">
                  Correct answer: <span className="font-medium">{q.correctAnswer}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="mt-8 w-full py-3 rounded-xl bg-zinc-900 text-white font-medium hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Submit Answers
        </button>
      ) : (
        <div className="mt-8 text-center">
          <div className="text-3xl font-bold mb-2">
            {score} / {questions.length}
          </div>
          <p className="text-zinc-500 mb-4">
            {score === questions.length
              ? "Perfect score!"
              : score >= questions.length * 0.7
              ? "Great job!"
              : "Keep practicing!"}
          </p>
          <button
            onClick={handleRetry}
            className="px-6 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
