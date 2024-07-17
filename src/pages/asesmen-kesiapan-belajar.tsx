import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { IDBPDatabase } from "idb";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/shadcn/Dialog";
import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import {
  AssessmentHeader,
  AssessmentTimer,
  NavList,
} from "@components/AssessmentHeader";
import { AssessmentContent } from "@components/AssessmentContent";
import { RestArea } from "@components/RestArea";
import { LoaderSpinner } from "@components/icons/LoaderSpinner";
import {
  putManyQuestion,
  putManySubtest,
  openAssessmentTrackerDB,
  type AssessmentTrackerDBSchema,
  type Subtest,
  type Question,
} from "@utils/assessmentTracker";
import MaskotHeadImages from "@public/maskot-head.png";

// dummy data
import { questionsDummyData, subtestsDummyData } from "../data/akb";

export default function AsesmenKesiapanBelajar() {
  const [timer, setTimer] = useState(0);
  const [indexedDB, setIndexedDB] =
    useState<IDBPDatabase<AssessmentTrackerDBSchema>>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubtestFinished, setIsSubtestFinished] = useState(false);
  const [isAssessmentTimeout, setIsAssessmentTimeout] = useState(false);

  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [currentSubtestIndex, setCurrentSubtestIndex] = useState(0);

  const [currentSubtestQuestions, setCurrentSubtestQuestions] = useState<
    Question[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const isLastSubtest = currentSubtestIndex === subtests.length - 1;
  const isLastQuestion =
    currentQuestionIndex === currentSubtestQuestions.length - 1;

  const submitSubtest = useCallback(async (): Promise<Question[]> => {
    try {
      // get questions from the server to replace "questionsDummyData",
      // based on the "currentSubtestIndex + 1"
      const currentSubtest = subtests[currentSubtestIndex];
      await Promise.all([
        indexedDB!.put("subtest", {
          ...currentSubtest,
          isSubmitted: true,
        }),
        putManyQuestion(
          questionsDummyData.slice(2, questionsDummyData.length),
          subtests[currentSubtestIndex + 1].id,
          indexedDB!
        ),
      ]);

      const storedQuestions = await indexedDB!.getAllFromIndex(
        "question",
        "subtestID",
        subtests[currentSubtestIndex + 1].id
      );
      return storedQuestions;
    } catch (error) {
      throw new Error(
        "Failed when update submitted subtest and get the next subtest questions: ",
        { cause: error }
      );
    }
  }, [currentSubtestIndex, indexedDB, subtests]);

  const handleAssessmentOnSubmit = useCallback(async () => {
    console.log(await indexedDB!.getAll("subtest"));
    console.log(await indexedDB!.getAll("question"));
  }, [indexedDB]);

  // Submit the current subtest and show "RestArea".
  // Prepare the questions for the next subtest.
  const handleSubtestOnSubmit = useCallback(async () => {
    try {
      const storedQuestions = await submitSubtest();
      // the "storedQuestions" must be sorted first
      setCurrentSubtestQuestions(storedQuestions);
      setCurrentSubtestIndex(currentSubtestIndex + 1);
      setCurrentQuestionIndex(0);
      setIsSubtestFinished(true);
      setTimer(4);
    } catch (error) {
      // Log the error properly
      console.log(error);
    }
  }, [currentSubtestIndex, submitSubtest]);

  function handleNextQuestionOnClick() {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handlePrevQuestionOnClick() {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }

  function handleRestAreaOnClick() {
    setIsSubtestFinished(false);
    setTimer(5);
  }

  const assessmentTimerHandler = useCallback(() => {
    if (isLastSubtest === false) {
      setIsAssessmentTimeout(false);
      setCurrentSubtestIndex(currentSubtestIndex + 1);
      setIsSubtestFinished(true);
      setTimer(4);
    } else {
      (async () => {
        console.log(await indexedDB!.getAll("subtest"));
        console.log(await indexedDB!.getAll("question"));
      })();
    }
  }, [isLastSubtest, currentSubtestIndex, indexedDB]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    // Decrease the timer for "RestArea", and
    // get out from "RestArea" when the timer is up and start the next subtest.
    if (isSubtestFinished) {
      timeout = setTimeout(() => {
        if (timer === 0) {
          handleRestAreaOnClick();
        } else {
          setTimer(timer - 1);
        }
      }, 1000);
    }

    // Decrease the timer for popup (the popup is displayed when the subtest time is up), and
    // show "RestArea" when the timer is up.
    if (isAssessmentTimeout) {
      timeout = setTimeout(() => {
        if (timer === 0) {
          assessmentTimerHandler();
        } else {
          setTimer(timer - 1);
        }
      }, 1000);
    }

    // Decrease the timer for subtest with optimistic update and update it on indexedDB.
    // Show a popup when the timer is up and prepare the question for the next subtest.
    if (isSubtestFinished === false && isAssessmentTimeout === false) {
      timeout = setTimeout(() => {
        if (timer === 0) {
          setIsAssessmentTimeout(true);
          setTimer(3);

          if (isLastSubtest === false) {
            (async () => {
              try {
                const storedQuestions = await submitSubtest();
                // the "storedQuestions" must be sorted first
                setCurrentSubtestQuestions(storedQuestions);
                setCurrentQuestionIndex(0);
              } catch (error) {
                // Log the error properly
                console.log(error);
              }
            })();
          }
        } else {
          setTimer(timer - 1);
          (async () => {
            try {
              const currentSubtest = subtests[currentSubtestIndex];
              await indexedDB!.put("subtest", {
                ...currentSubtest,
                timer: timer - 1,
              });
            } catch (error) {
              // Log the error properly
              console.log(error);
              setTimer(timer + 1);
            }
          })();
        }
      }, 1000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    currentSubtestIndex,
    indexedDB,
    isAssessmentTimeout,
    isLastSubtest,
    isSubtestFinished,
    submitSubtest,
    subtests,
    timer,
    assessmentTimerHandler,
  ]);

  useEffect(() => {
    // Check if indexedDB is supported or not.
    // Check whether the user resume their assessment or not.
    if ("indexedDB" in window === false) {
      alert("your browser doesn't support indexedDB");
    } else {
      (async () => {
        try {
          const db = await openAssessmentTrackerDB();
          setIndexedDB(db);

          const subtests = await db.getAll("subtest");
          if (subtests.length === 0) {
            // get subtests from the server to replace "subtestsDummyData", and
            // for timer information
            await putManySubtest(subtestsDummyData, db);
            const sortedSubtests = await db.getAllFromIndex(
              "subtest",
              "sequenceNumber"
            );
            setSubtests(sortedSubtests);

            // get questions from the server to replace "questionsDummyData",
            // based on the first "sortedSubtestsID"
            await putManyQuestion(
              questionsDummyData.slice(0, 2),
              sortedSubtests[0].id,
              db
            );

            const storedQuestions = await db.getAllFromIndex(
              "question",
              "subtestID",
              sortedSubtests[0].id
            );

            // the "storedQuestions" must be sorted first
            setCurrentSubtestQuestions(storedQuestions);
            setTimer(5);
          } else {
            const sortedSubtests = await db.getAllFromIndex(
              "subtest",
              "sequenceNumber"
            );
            setSubtests(sortedSubtests);

            let indexOfFirstUnsubmittedSubtest = 0;
            for (let i = 0; i < sortedSubtests.length; i++) {
              if (sortedSubtests[i].isSubmitted === false) {
                indexOfFirstUnsubmittedSubtest = i;
                break;
              }
            }

            const currentSubtest =
              sortedSubtests[indexOfFirstUnsubmittedSubtest];
            setCurrentSubtestIndex(indexOfFirstUnsubmittedSubtest);

            if (currentSubtest.timer !== null) {
              const storedQuestions = await db.getAllFromIndex(
                "question",
                "subtestID",
                currentSubtest.id
              );

              setCurrentSubtestQuestions(storedQuestions);
              setTimer(currentSubtest.timer!);
            }

            if (currentSubtest.timer === null) {
              // get questions from server to replace "questionsDummyData",
              // based on the current subtest (first subtest with null timer)
              await putManyQuestion(
                questionsDummyData.slice(2, questionsDummyData.length),
                currentSubtest.id,
                db
              );

              const storedQuestions = await db.getAllFromIndex(
                "question",
                "subtestID",
                currentSubtest.id
              );

              // the "storedQuestions" must be sorted first
              setCurrentSubtestQuestions(storedQuestions);
              setTimer(5);
            }
          }
          setIsLoading(false);
        } catch (error) {
          // Log the error properly
          console.log(error);
        }
      })();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex flex-col justify-center items-center">
        <LoaderSpinner className="w-12 h-12 mb-16" />
        <Typography as="h1" variant="h5" weight="bold" className="mb-2">
          Tunggu sebentar ya!
        </Typography>
        <Typography variant="b3">
          Kami sedang mempersiapkan soal-soal untuk asesmenmu.
        </Typography>
      </div>
    );
  }

  if (isSubtestFinished) {
    return (
      <>
        <RestArea
          handleRestAreaOnClick={handleRestAreaOnClick}
          timer={timer}
          subtestsLength={subtests.length}
          completedSubtestIndex={currentSubtestIndex}
          nextSubtest={subtests[currentSubtestIndex]}
          nextSubtestQuestionsLength={currentSubtestQuestions.length}
        />
      </>
    );
  }

  return (
    <div className="w-full max-w-[calc(1366px-160px)] mx-auto mt-[calc(64px+32px)]">
      <AssessmentHeader
        subtestsLength={subtests.length}
        currentSubtestIndex={currentSubtestIndex + 1}
        currentSubtestName={subtests[currentSubtestIndex].name}
      >
        <div className="bg-secondary-50 flex justify-between items-center py-2 px-3 rounded-lg mb-6">
          <NavList
            currentQuestionIndex={currentQuestionIndex}
            currentSubtestQuestions={currentSubtestQuestions}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
          <AssessmentTimer
            currentSubtestTimer={isAssessmentTimeout ? 0 : timer}
          />
        </div>
      </AssessmentHeader>

      <AssessmentContent
        indexedDB={indexedDB!}
        currentQuestion={currentSubtestQuestions[currentQuestionIndex]}
        currentSubtestQuestions={currentSubtestQuestions}
        setCurrentSubtestQuestions={setCurrentSubtestQuestions}
      />

      <div className="flex justify-end items-center gap-x-8">
        <Button
          onClick={handlePrevQuestionOnClick}
          disabled={currentQuestionIndex === 0}
          variant="secondary"
          className="block text-center w-[164px]"
        >
          Kembali
        </Button>

        <Dialog>
          {isLastQuestion ? (
            <DialogTrigger asChild>
              <Button
                disabled={
                  isAllQuestionAnswered(currentSubtestQuestions) === false
                }
                className="block text-center w-[164px]"
              >
                Serahkan
              </Button>
            </DialogTrigger>
          ) : (
            <Button
              onClick={handleNextQuestionOnClick}
              className="block text-center w-[164px]"
            >
              Selanjutnya
            </Button>
          )}

          {/* The popup will displayed when the user submit the subtest */}
          <DialogContent className="w-full max-w-md">
            <Image
              src={MaskotHeadImages}
              width={180}
              height={180}
              alt="Emteka Maskot (Head)"
              className="object-cover object-center mx-auto"
            />

            <DialogDescription asChild>
              <Typography
                as="h3"
                variant="h5"
                weight="bold"
                className="text-neutral-700 text-center mb-6"
              >
                Apakah sudah yakin ingin menyerahkan jawabanmu?
              </Typography>
            </DialogDescription>

            <DialogFooter className="flex justify-between items-center gap-x-4">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="block text-center w-full"
                >
                  Batal
                </Button>
              </DialogClose>

              <DialogClose asChild>
                <Button
                  onClick={
                    isLastSubtest
                      ? handleAssessmentOnSubmit
                      : handleSubtestOnSubmit
                  }
                  variant="primary"
                  className="block text-center w-full"
                >
                  Ya
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isAssessmentTimeout}
          onOpenChange={assessmentTimerHandler}
        >
          <DialogContent>
            <TimeIsUpPopup timer={timer} isLastSubtest={isLastSubtest} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

function isAllQuestionAnswered(questions: Question[]): boolean {
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].answeredAnswerChoiceID === "") {
      return false;
    }
  }
  return true;
}

interface TimeIsUpPopupProps {
  timer: number;
  isLastSubtest: boolean;
}

function TimeIsUpPopup({ timer, isLastSubtest }: TimeIsUpPopupProps) {
  return (
    <>
      <Image
        src={MaskotHeadImages}
        width={180}
        height={180}
        alt="Emteka Maskot (Head)"
        className="object-cover object-center mx-auto"
      />

      <DialogHeader className="w-full max-w-96 mx-auto mb-8">
        <DialogTitle asChild>
          <Typography
            as="h3"
            variant="h5"
            weight="bold"
            className="text-neutral-700 text-center mb-2"
          >
            Waktu Habis!
          </Typography>
        </DialogTitle>

        <DialogDescription asChild>
          <>
            <Typography
              variant="b2"
              className="text-neutral-500 text-center mb-2"
            >
              Waktu pengerjaan subtes ini telah habis.
            </Typography>

            <Typography
              variant="b2"
              weight="bold"
              className="text-neutral-500 text-center"
            >
              Kamu akan diarahkan ke&nbsp;
              {isLastSubtest ? "halaman hasil asesmen" : "subtes selanjutnya"}
              &nbsp; dalam&nbsp;
              <span className="text-secondary-500">{timer} detik</span>.
            </Typography>
          </>
        </DialogDescription>
      </DialogHeader>
    </>
  );
}

// jika "timer" pada asesmen merupakan atribut pada subtes, misalnya "duration",
// maka perlu atribut lain untuk menyimpan nilai "countdown"
