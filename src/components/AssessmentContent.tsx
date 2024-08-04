import type { DeltaOperation } from "@customTypes/editor";
import type {
  AssessmentResponse,
  AssessmentTrackerDBSchema,
} from "@utils/assessmentTracker";
import type { IDBPDatabase } from "idb";
import katex from "katex";
import Head from "next/head";
import Image from "next/image";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import {
  type Dispatch,
  memo,
  type MouseEvent,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

import { RadioButtonCheckedIcon } from "./icons/RadioButtonCheckedIcon";
import { RadioButtonUncheckedIcon } from "./icons/RadioButtonUncheckedIcon";
import { Dialog, DialogContent } from "./shadcn/Dialog";

interface AssessmentContentProps {
  indexedDB: IDBPDatabase<AssessmentTrackerDBSchema>;
  currentQuestion: AssessmentResponse;
  currentSubtestQuestions: AssessmentResponse[];
  setCurrentSubtestQuestions: Dispatch<SetStateAction<AssessmentResponse[]>>;
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
            selectedChoiceID: event.currentTarget.id,
          };
        }

        return question;
      }),
    );

    (async () => {
      try {
        await indexedDB!.put("question", {
          ...currentQuestion,
          selectedChoiceID: event.currentTarget.id,
        });
      } catch (error) {
        // Log the error properly
        console.log(error);

        setCurrentSubtestQuestions(
          currentSubtestQuestions.map((question) => {
            if (question.id === currentQuestion.id) {
              return {
                ...question,
                selectedChoiceID: "",
              };
            }

            return question;
          }),
        );
      }
    })();
  }

  // Attach event handler on click to show image preview
  useEffect(() => {
    const questionContainer = document.getElementById(
      "question-container",
    ) as HTMLDivElement;

    const imgEls = questionContainer.getElementsByClassName(
      "ql-image",
    ) as HTMLCollectionOf<HTMLImageElement>;

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
          rel='stylesheet'
          href='https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css'
          integrity='sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+'
          crossOrigin='anonymous'
        />
      </Head>

      <div className='flex justify-between gap-x-6'>
        <div
          dangerouslySetInnerHTML={{
            __html: deltaToHTMLString(JSON.parse(currentQuestion.content)),
          }}
          id='question-container'
          className='w-full text-xl text-neutral-700 [&_img]:my-6 [&_img]:h-[280px] [&_img]:w-[280px] [&_img]:object-cover [&_img]:object-center [&_ol]:ml-8 [&_ol]:mt-4 [&_ol]:flex [&_ol]:list-decimal [&_ol]:flex-col [&_ol]:justify-between [&_ol]:gap-y-0.5 [&_ul]:ml-8 [&_ul]:mt-4 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:justify-between [&_ul]:gap-y-0.5'
        ></div>

        <Dialog open={isImgPreviewOpened} onOpenChange={setIsImgPreviewOpened}>
          <DialogContent
            type='lightbox'
            className='flex items-center justify-center'
          >
            <div className='relative h-[538px] w-[538px]'>
              <Image
                src={imgURL}
                alt=''
                className='object-cover object-center'
                fill
              />
            </div>
          </DialogContent>
        </Dialog>

        <ul className='flex w-full max-w-96 flex-col gap-y-4'>
          {currentQuestion.multipleChoice.map((answerChoice) => {
            return (
              <li
                key={answerChoice.id}
                onClick={handleAnswerChoiceOnClick}
                id={answerChoice.id}
                className='flex cursor-pointer items-center gap-x-4 rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3.5'
              >
                {answerChoice.id === currentQuestion.selectedChoiceID ? (
                  <RadioButtonCheckedIcon className='h-6 w-6 shrink-0 fill-secondary-600' />
                ) : (
                  <RadioButtonUncheckedIcon className='h-6 w-6 shrink-0 fill-neutral-400' />
                )}

                <div
                  dangerouslySetInnerHTML={{
                    __html: deltaToHTMLString(JSON.parse(answerChoice.content)),
                  }}
                  className='text-neutral-700 [&_img]:h-[200px] [&_img]:w-[200px] [&_img]:object-cover [&_img]:object-center'
                ></div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
});

function deltaToHTMLString(deltaOperations: DeltaOperation[]): string {
  const deltaConverter = new QuillDeltaToHtmlConverter(deltaOperations);
  deltaConverter.afterRender((_, HTMLString) => {
    const HTMLDoc = new DOMParser().parseFromString(HTMLString, "text/html");
    const bodyEl = HTMLDoc.getElementsByTagName("body")[0];
    const latexContainers = bodyEl.querySelectorAll(".ql-formula");

    for (let i = 0; i < latexContainers.length; i++) {
      const latex = latexContainers[i].innerHTML;
      latexContainers[i].insertAdjacentHTML(
        "beforebegin",
        katex.renderToString(latex),
      );
      latexContainers[i].remove();
    }

    return bodyEl.innerHTML;
  });

  const HTMLString = deltaConverter.convert();
  return HTMLString;
}
