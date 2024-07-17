import Head from "next/head";
import Image from "next/image";
import {
  memo,
  useEffect,
  useState,
  type MouseEvent,
  type Dispatch,
  type SetStateAction,
} from "react";
import katex from "katex";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import type { IDBPDatabase } from "idb";

import { Dialog, DialogContent } from "./shadcn/Dialog";
import { RadioButtonCheckedIcon } from "./icons/RadioButtonCheckedIcon";
import { RadioButtonUncheckedIcon } from "./icons/RadioButtonUncheckedIcon";
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
  const [imgURL, setImgURL] = useState("");
  const [isImgPreviewOpened, setIsImgPreviewOpened] = useState(false);

  // Update the question based on the selected answer choice on indexedDB, and
  // implement optimistic update.
  function handleAnswerChoiceOnClick(event: MouseEvent<HTMLLIElement>) {
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

  // Attach event handler on click to show image preview
  useEffect(() => {
    const questionContainer = document.getElementById(
      "question-container"
    ) as HTMLDivElement;

    const imgEls = questionContainer.getElementsByClassName(
      "ql-image"
    ) as HTMLCollectionOf<HTMLImageElement>;

    // eslint-disable-next-line no-unused-vars
    const onClickHandlers: Array<(event: globalThis.MouseEvent) => void> =
      new Array(imgEls.length);

    // loop through each element and attach a listener on each of them
    // store the handler in a pre-defined array that will be used on cleanup function
    for (let i = 0; i < imgEls.length; i++) {
      const handleImgOnClick = (event: globalThis.MouseEvent) => {
        const imgEl = event.currentTarget as HTMLImageElement;
        setImgURL(imgEl.getAttribute("src")!);
        setIsImgPreviewOpened(true);
      };

      imgEls[i].addEventListener("click", handleImgOnClick);
      onClickHandlers[i] = handleImgOnClick;
    }

    return () => {
      if (imgEls.length !== 0) {
        for (let i = 0; i < imgEls.length; i++) {
          imgEls[i].removeEventListener("click", onClickHandlers[i]);
        }
      }
    };
  }, []);

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

      <div className="flex justify-between gap-x-6">
        <div
          dangerouslySetInnerHTML={{
            __html: deltaToHTMLString(JSON.parse(currentQuestion.content)),
          }}
          id="question-container"
          className="text-neutral-700 text-xl w-full [&_img]:w-[280px] [&_img]:h-[280px] [&_img]:object-cover [&_img]:object-center [&_img]:my-6"
        ></div>

        <Dialog open={isImgPreviewOpened} onOpenChange={setIsImgPreviewOpened}>
          <DialogContent
            type="lightbox"
            className="flex justify-center items-center"
          >
            <div className="relative w-[538px] h-[538px]">
              <Image
                src={imgURL}
                alt=""
                className="object-cover object-center"
                fill
              />
            </div>
          </DialogContent>
        </Dialog>

        <ul className="flex flex-col gap-y-4 w-full max-w-96">
          {currentQuestion.multipleChoice.map((answerChoice) => {
            return (
              <li
                key={answerChoice.id}
                onClick={handleAnswerChoiceOnClick}
                id={answerChoice.id}
                className="bg-neutral-50 border border-neutral-100 rounded-lg cursor-pointer flex items-center gap-x-4 py-3.5 px-4"
              >
                {answerChoice.id === currentQuestion.answeredAnswerChoiceID ? (
                  <RadioButtonCheckedIcon className="shrink-0 fill-secondary-600 w-6 h-6" />
                ) : (
                  <RadioButtonUncheckedIcon className="shrink-0 fill-neutral-400 w-6 h-6" />
                )}

                <div
                  dangerouslySetInnerHTML={{
                    __html: deltaToHTMLString(JSON.parse(answerChoice.content)),
                  }}
                  className="text-neutral-700 [&_img]:w-[200px] [&_img]:h-[200px] [&_img]:object-cover [&_img]:object-center"
                ></div>
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
