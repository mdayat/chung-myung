import type { Question } from "@utils/assessmentTracker";
import {
  type Dispatch,
  memo,
  type MouseEvent,
  type PropsWithChildren,
  type SetStateAction,
} from "react";

import { TimerIcon } from "./icons/TimerIcon";
import { Typography } from "./shadcn/Typography";

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
      <div className='mb-4 flex items-center justify-between'>
        <Typography as='h1' variant='h3' weight='bold'>
          {currentSubtestName}
        </Typography>

        <div className='flex items-center justify-between gap-x-2.5 rounded-full border border-neutral-700 px-4 py-2'>
          <p className='flex items-center justify-between'>
            <Typography
              as='span'
              variant='b3'
              weight='bold'
              className='text-neutral-700'
            >
              {currentSubtestIndex}
            </Typography>
            <Typography as='span' variant='b3' className='text-neutral-700'>
              /{subtestsLength}
            </Typography>
          </p>

          <Typography variant='b3' weight='bold' className='text-neutral-700'>
            Subtes
          </Typography>
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
    <ul className='flex items-center justify-between gap-x-2'>
      {currentSubtestQuestions.map((question, index) => {
        const isCurrentQuestion =
          currentSubtestQuestions[currentQuestionIndex].id === question.id;
        const isAnswered = question.answeredAnswerChoiceID !== "";

        let navItemColor = "";
        if (isCurrentQuestion) {
          navItemColor = "bg-secondary-500 text-neutral-25";
        } else if (isAnswered) {
          navItemColor = "bg-secondary-200 text-neutral-700";
        } else {
          navItemColor =
            "bg-neutral-0 text-neutral-700 border border-neutral-100";
        }

        function handleNavItemOnClick(event: MouseEvent<HTMLButtonElement>) {
          const navItemIndex = Number(
            event.currentTarget.getAttribute("data-index"),
          );
          setCurrentQuestionIndex(navItemIndex);
        }

        return (
          <li key={question.id}>
            <button
              onClick={handleNavItemOnClick}
              data-index={index}
              className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-medium ${navItemColor}`}
              type='button'
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
  const isUnderFiveMinutes = currentSubtestTimer < 300;
  const hours = Math.floor(currentSubtestTimer / (60 * 60));
  const minutes = Math.floor(currentSubtestTimer / 60);
  const seconds = Math.floor(currentSubtestTimer % 60);

  return (
    <div className='flex items-center justify-between gap-x-4'>
      <TimerIcon className='h-6 w-6 fill-neutral-900' />
      <div className='flex items-center justify-between gap-x-2'>
        <span
          className={`${isUnderFiveMinutes ? "bg-error-100" : "bg-secondary-200"} flex h-10 w-10 items-center justify-center rounded-xl text-lg text-neutral-950`}
        >
          {String(hours).padStart(2, "0")}
        </span>
        :
        <span
          className={`${isUnderFiveMinutes ? "bg-error-100" : "bg-secondary-200"} flex h-10 w-10 items-center justify-center rounded-xl text-lg text-neutral-950`}
        >
          {String(minutes).padStart(2, "0")}
        </span>
        :
        <span
          className={`${isUnderFiveMinutes ? "bg-error-100" : "bg-secondary-200"} flex h-10 w-10 items-center justify-center rounded-xl text-lg text-neutral-950`}
        >
          {String(seconds).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export { AssessmentHeader, AssessmentTimer, NavList };
