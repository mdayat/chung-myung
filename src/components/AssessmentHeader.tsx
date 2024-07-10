import {
  memo,
  type Dispatch,
  type MouseEvent,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import type { Question } from "@utils/assessmentTracker";

import { TimerIcon } from "./icons/TimerIcon";

interface AssessmentHeaderProps extends PropsWithChildren {
  subtestsLength: number;
  currentSubtestName: string;
  currentSubtestIndex: number;
}

function AssessmentHeader({
  currentSubtestIndex,
  currentSubtestName,
  subtestsLength,
  children,
}: AssessmentHeaderProps) {
  return (
    <>
      <div className="flex justify-between items-center">
        <h2>{currentSubtestName}</h2>
        <div>
          <span>{currentSubtestIndex}</span>/<span>{subtestsLength}</span>&nbsp;
          <span>Subtes</span>
        </div>
      </div>

      {children}
    </>
  );
}

interface NavListProps {
  currentSubtestQuestions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: Dispatch<SetStateAction<number>>;
}

const NavList = memo(function NavList({
  currentSubtestQuestions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
}: NavListProps) {
  return (
    <ul className="flex justify-start items-center gap-x-6">
      {currentSubtestQuestions.map((question, index) => {
        const isCurrentQuestion =
          currentSubtestQuestions[currentQuestionIndex].id === question.id;
        const isAnswered = question.answeredAnswerChoiceID !== "";

        let navItemColor = "";
        if (isCurrentQuestion) {
          navItemColor = "bg-secondary-600";
        } else if (isAnswered) {
          navItemColor = "bg-success-600";
        } else {
          navItemColor = "bg-neutral-300";
        }

        function handleNavItemOnClick(event: MouseEvent<HTMLButtonElement>) {
          const navItemIndex = Number(
            event.currentTarget.getAttribute("data-index")
          );
          setCurrentQuestionIndex(navItemIndex);
        }

        return (
          <li key={question.id}>
            <button
              data-index={index}
              className={`${navItemColor} w-6 h-6 rounded-full`}
              onClick={handleNavItemOnClick}
              type="button"
            >
              {index + 1}
            </button>
          </li>
        );
      })}
    </ul>
  );
});

interface AssessmentTimerProps {
  currentSubtestTimer: number;
}

function AssessmentTimer({ currentSubtestTimer }: AssessmentTimerProps) {
  return (
    <div>
      <TimerIcon className="w-6 gap-6" /> {currentSubtestTimer}
    </div>
  );
}

export { AssessmentHeader, NavList, AssessmentTimer };
