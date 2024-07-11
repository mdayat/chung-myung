import Head from "next/head";
import {
  memo,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import katex from "katex";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import type { IDBPDatabase } from "idb";

import type {
  AssessmentTrackerDBSchema,
  Question,
} from "@utils/assessmentTracker";
import type { DeltaOps } from "@customTypes/question";

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
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
          integrity="sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+"
          crossOrigin="anonymous"
        />
      </Head>

      <div className="grid grid-cols-2">
        <div
          dangerouslySetInnerHTML={{
            __html: deltaToHTMLString(JSON.parse(currentQuestion.content)),
          }}
        ></div>

        <ul className="flex flex-col">
          {currentQuestion.multipleChoice.map((answerChoice) => {
            return (
              <li key={answerChoice.id}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: deltaToHTMLString(JSON.parse(answerChoice.content)),
                  }}
                ></div>

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
    </>
  );
});

function deltaToHTMLString(deltaOps: DeltaOps): string {
  const deltaConverter = new QuillDeltaToHtmlConverter(deltaOps);
  deltaConverter.afterRender((_, HTMLString) => {
    const HTMLDoc = new DOMParser().parseFromString(HTMLString, "text/html");
    const bodyEl = HTMLDoc.getElementsByTagName("body")[0];
    const latexContainers = bodyEl.querySelectorAll(".ql-formula");

    for (let i = 0; i < latexContainers.length; i++) {
      const latex = latexContainers[i].innerHTML;
      latexContainers[i].insertAdjacentHTML(
        "beforebegin",
        katex.renderToString(latex)
      );
      latexContainers[i].remove();
    }

    return bodyEl.innerHTML;
  });

  const HTMLString = deltaConverter.convert();
  return HTMLString;
}
