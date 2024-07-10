import {
  memo,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import type { IDBPDatabase } from "idb";

import type {
  AssessmentTrackerDBSchema,
  Question,
} from "@utils/assessmentTracker";

interface AssessmentContentProps {
  indexedDB: IDBPDatabase<AssessmentTrackerDBSchema>;
  currentQuestion: Question;
  currentSubtestQuestions: Question[];
  setCurrentSubtestQuestions: Dispatch<SetStateAction<Question[]>>;
}

export const AssessmentContent = memo(function AssessmentContent({
  indexedDB,
  currentQuestion,
  currentSubtestQuestions,
  setCurrentSubtestQuestions,
}: AssessmentContentProps) {
  // update question based on the selected answer choice, and
  // implement optimistic update
  function handleAnswerChoiceOnChange(event: ChangeEvent<HTMLInputElement>) {
    setCurrentSubtestQuestions(
      currentSubtestQuestions.map((question) => {
        if (question.id === currentQuestion.id) {
          return {
            ...question,
            answeredAnswerChoiceID: event.currentTarget.id,
          };
        }

        return question;
      })
    );

    (async () => {
      try {
        await indexedDB!.put("question", {
          ...currentQuestion,
          answeredAnswerChoiceID: event.currentTarget.id,
        });
      } catch (error) {
        // Log the error properly
        console.log(error);

        setCurrentSubtestQuestions(
          currentSubtestQuestions.map((question) => {
            if (question.id === currentQuestion.id) {
              return {
                ...question,
                answeredAnswerChoiceID: "",
              };
            }

            return question;
          })
        );
      }
    })();
  }

  return (
    <div className="grid grid-cols-2">
      <p className="bg-neutral-300">{currentQuestion.content}</p>

      <ul className="flex flex-col">
        {currentQuestion.multipleChoice.map((answerChoice) => {
          return (
            <li key={answerChoice.id} className="">
              <p>{answerChoice.content}</p>
              <input
                id={answerChoice.id}
                checked={
                  answerChoice.id === currentQuestion.answeredAnswerChoiceID
                }
                onChange={handleAnswerChoiceOnChange}
                type="radio"
                name="answerChoice"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
});
