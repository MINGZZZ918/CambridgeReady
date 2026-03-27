"use client";

import { useState } from "react";
import type { MatchingContent } from "@/types";

interface Props {
  content: MatchingContent;
  userMatches: Record<string, string>;
  submitted: boolean;
  onChange: (matches: Record<string, string>) => void;
}

export default function MatchingQuestion({ content, userMatches, submitted, onChange }: Props) {
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);

  const handlePersonClick = (personId: string) => {
    if (submitted) return;
    setSelectedPerson((prev) => (prev === personId ? null : personId));
  };

  const handleTextClick = (textLabel: string) => {
    if (submitted || !selectedPerson) return;
    const updated = { ...userMatches, [selectedPerson]: textLabel };
    onChange(updated);
    setSelectedPerson(null);
  };

  // Reverse lookup: which person is assigned to which text
  const textAssignments: Record<string, string> = {};
  for (const [personId, textLabel] of Object.entries(userMatches)) {
    textAssignments[textLabel] = personId;
  }

  return (
    <div className="space-y-6">
      {/* Stem */}
      <p className="text-base font-medium text-text-primary">{content.stem}</p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left column: people */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-text-secondary mb-2">人物</div>
          {content.people.map((person) => {
            const personId = String(person.id);
            const isSelected = selectedPerson === personId;
            const assignedText = userMatches[personId];
            const isCorrect = submitted && assignedText === content.correct_matches[personId];
            const isWrong = submitted && assignedText !== undefined && assignedText !== content.correct_matches[personId];

            let borderColor = "border-border";
            let bg = "bg-bg-card";

            if (submitted) {
              if (isCorrect) {
                borderColor = "border-ket";
                bg = "bg-ket-light";
              } else if (isWrong) {
                borderColor = "border-red-400";
                bg = "bg-red-50";
              }
            } else if (isSelected) {
              borderColor = "border-blue";
              bg = "bg-blue-light";
            }

            return (
              <button
                key={personId}
                onClick={() => handlePersonClick(personId)}
                disabled={submitted}
                className={`flex w-full items-start gap-3 rounded-[--radius-md] border p-4 text-left transition-all ${borderColor} ${bg} ${
                  !submitted ? "hover:border-blue/40 active:scale-[0.99]" : ""
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    submitted
                      ? isCorrect
                        ? "bg-ket text-white"
                        : isWrong
                        ? "bg-red-400 text-white"
                        : "bg-bg text-text-secondary border border-border"
                      : isSelected
                      ? "bg-blue text-white"
                      : "bg-bg text-text-secondary border border-border"
                  }`}
                >
                  {person.id}
                </span>
                <div className="flex-1">
                  <span className="text-[15px] leading-relaxed text-text-primary">
                    {person.description}
                  </span>
                  {assignedText && (
                    <span className="mt-1 block text-xs font-medium text-text-secondary">
                      → {assignedText}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column: texts */}
        <div className="space-y-3">
          <div className="text-sm font-medium text-text-secondary mb-2">文本</div>
          {content.texts.map((text) => {
            const assignedPerson = textAssignments[text.label];
            const isAssigned = assignedPerson !== undefined;

            // Check correctness for this text assignment
            let isCorrectAssignment = false;
            let isWrongAssignment = false;
            if (submitted && isAssigned) {
              isCorrectAssignment = content.correct_matches[assignedPerson] === text.label;
              isWrongAssignment = !isCorrectAssignment;
            }

            let borderColor = "border-border";
            let bg = "bg-bg-card";

            if (submitted) {
              if (isCorrectAssignment) {
                borderColor = "border-ket";
                bg = "bg-ket-light";
              } else if (isWrongAssignment) {
                borderColor = "border-red-400";
                bg = "bg-red-50";
              }
            } else if (isAssigned) {
              borderColor = "border-blue/30";
              bg = "bg-blue-light/50";
            }

            return (
              <button
                key={text.label}
                onClick={() => handleTextClick(text.label)}
                disabled={submitted || !selectedPerson}
                className={`flex w-full items-start gap-3 rounded-[--radius-md] border p-4 text-left transition-all ${borderColor} ${bg} ${
                  !submitted && selectedPerson
                    ? "hover:border-blue/40 active:scale-[0.99] cursor-pointer"
                    : !submitted
                    ? "cursor-default"
                    : ""
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                    submitted
                      ? isCorrectAssignment
                        ? "bg-ket text-white"
                        : isWrongAssignment
                        ? "bg-red-400 text-white"
                        : "bg-bg text-text-secondary border border-border"
                      : isAssigned
                      ? "bg-blue/20 text-blue border border-blue/30"
                      : "bg-bg text-text-secondary border border-border"
                  }`}
                >
                  {text.label}
                </span>
                <span className="text-[15px] leading-relaxed text-text-primary">
                  {text.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Show correct matches after submit if any wrong */}
      {submitted && Object.entries(content.correct_matches).some(
        ([key, val]) => userMatches[key] !== val
      ) && (
        <div className="rounded-[--radius-md] bg-ket-light p-4">
          <div className="text-sm font-medium text-ket mb-2">正确匹配：</div>
          <div className="space-y-1">
            {Object.entries(content.correct_matches).map(([personId, textLabel]) => {
              const person = content.people.find((p) => String(p.id) === personId);
              return (
                <div key={personId} className="text-[13px] text-ket">
                  {person?.id}. {person?.description} → {textLabel}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
