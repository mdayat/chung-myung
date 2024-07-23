import { AssessmentContent } from "@components/AssessmentContent";
import {
  AssessmentHeader,
  AssessmentTimer,
  NavList,
} from "@components/AssessmentHeader";
import { LoaderSpinner } from "@components/icons/LoaderSpinner";
import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";
import { RestArea } from "@components/RestArea";
import { Button } from "@components/shadcn/Button";
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
import { Typography } from "@components/shadcn/Typography";
import MaskotHeadImages from "@public/maskot-head.png";
import {
  type AssessmentTrackerDBSchema,
  openAssessmentTrackerDB,
  putManyQuestion,
  putManySubtest,
  type Question,
  type Subtest,
} from "@utils/assessmentTracker";
import { karla, nunito } from "@utils/fonts";
import { type IDBPDatabase } from "idb";
import Image from "next/image";
import { type ReactElement, useCallback, useEffect, useState } from "react";

import type { NextPageWithLayout } from "./_app";
// dummy data
import { questionsDummyData, subtestsDummyData } from "../data/akb";

const AsesmenKesiapanBelajar: NextPageWithLayout = () => {
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
          indexedDB!,
        ),
      ]);

      const storedQuestions = await indexedDB!.getAllFromIndex(
        "question",
        "subtestID",
        subtests[currentSubtestIndex + 1].id,
      );
      return storedQuestions;
    } catch (error) {
      throw new Error(
        "Failed when update submitted subtest and get the next subtest questions: ",
        { cause: error },
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
      setTimer(20);
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
      setTimer(20);
    } else {
      (async () => {
        console.log(await indexedDB!.getAll("subtest"));
        console.log(await indexedDB!.getAll("question"));
      })();
    }
  }, [isLastSubtest, currentSubtestIndex, indexedDB]);

  // Lock the page height to the screen when the user is at "RestArea"
  useEffect(() => {
    const mainEl = document.getElementsByTagName("main")[0] as HTMLElement;
    if (isSubtestFinished) {
      mainEl.classList.add("relative", "h-screen", "overflow-hidden");
    } else {
      mainEl.classList.remove("relative", "h-screen", "overflow-hidden");
    }
  }, [isSubtestFinished]);

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
              "sequenceNumber",
            );
            setSubtests(sortedSubtests);

            // get questions from the server to replace "questionsDummyData",
            // based on the first "sortedSubtestsID"
            await putManyQuestion(
              questionsDummyData.slice(0, 2),
              sortedSubtests[0].id,
              db,
            );

            const storedQuestions = await db.getAllFromIndex(
              "question",
              "subtestID",
              sortedSubtests[0].id,
            );

            // the "storedQuestions" must be sorted first
            setCurrentSubtestQuestions(storedQuestions);
            setTimer(5);
          } else {
            const sortedSubtests = await db.getAllFromIndex(
              "subtest",
              "sequenceNumber",
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
                currentSubtest.id,
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
                db,
              );

              const storedQuestions = await db.getAllFromIndex(
                "question",
                "subtestID",
                currentSubtest.id,
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
      <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center'>
        <LoaderSpinner className='mb-16 h-12 w-12' />
        <Typography as='h1' variant='h5' weight='bold' className='mb-2'>
          Tunggu sebentar ya!
        </Typography>
        <Typography variant='b3'>
          Kami sedang mempersiapkan soal-soal untuk asesmenmu.
        </Typography>
      </div>
    );
  }

  if (isSubtestFinished) {
    return (
      <>
        <Navbar bgColor='bg-transparent'>
          <ProfileMenu />
        </Navbar>

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
    <>
      <Navbar bgColor='bg-transparent'>
        <HelpMenu withText />
        <ProfileMenu />
      </Navbar>

      <div className='mx-auto mt-[calc(64px+32px)] w-full max-w-[calc(1366px-160px)]'>
        <AssessmentHeader
          subtestsLength={subtests.length}
          currentSubtestIndex={currentSubtestIndex + 1}
          currentSubtestName={subtests[currentSubtestIndex].name}
        >
          <div className='mb-6 flex items-center justify-between rounded-lg bg-secondary-50 px-3 py-2'>
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

        <div className='flex items-center justify-end gap-x-8'>
          <Button
            onClick={handlePrevQuestionOnClick}
            disabled={currentQuestionIndex === 0}
            variant='secondary'
            className='block w-[164px] text-center'
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
                  className='block w-[164px] text-center'
                >
                  Serahkan
                </Button>
              </DialogTrigger>
            ) : (
              <Button
                onClick={handleNextQuestionOnClick}
                className='block w-[164px] text-center'
              >
                Selanjutnya
              </Button>
            )}

            {/* The popup will displayed when the user submit the subtest */}
            <DialogContent className='w-full max-w-md'>
              <Image
                src={MaskotHeadImages}
                width={180}
                height={180}
                alt='Emteka Maskot (Head)'
                className='mx-auto object-cover object-center'
              />

              <DialogDescription asChild>
                <Typography
                  as='h3'
                  variant='h5'
                  weight='bold'
                  className='mb-6 text-center text-neutral-700'
                >
                  Apakah sudah yakin ingin menyerahkan jawabanmu?
                </Typography>
              </DialogDescription>

              <DialogFooter className='flex items-center justify-between gap-x-4'>
                <DialogClose asChild>
                  <Button
                    variant='secondary'
                    className='block w-full text-center'
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
                    variant='primary'
                    className='block w-full text-center'
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
    </>
  );
};

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
        alt='Emteka Maskot (Head)'
        className='mx-auto object-cover object-center'
      />

      <DialogHeader className='mx-auto mb-8 w-full max-w-96'>
        <DialogTitle asChild>
          <Typography
            as='h3'
            variant='h5'
            weight='bold'
            className='mb-2 text-center text-neutral-700'
          >
            Waktu Habis!
          </Typography>
        </DialogTitle>

        <DialogDescription asChild>
          <>
            <Typography
              variant='b2'
              className='mb-2 text-center text-neutral-500'
            >
              Waktu pengerjaan subtes ini telah habis.
            </Typography>

            <Typography
              variant='b2'
              weight='bold'
              className='text-center text-neutral-500'
            >
              Kamu akan diarahkan ke&nbsp;
              {isLastSubtest ? "halaman hasil asesmen" : "subtes selanjutnya"}
              &nbsp; dalam&nbsp;
              <span className='text-secondary-500'>{timer} detik</span>.
            </Typography>
          </>
        </DialogDescription>
      </DialogHeader>
    </>
  );
}

AsesmenKesiapanBelajar.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} font-karla`}>
      {page}
    </main>
  );
};

export default AsesmenKesiapanBelajar;

// jika "timer" pada asesmen merupakan atribut pada subtes, misalnya "duration",
// maka perlu atribut lain untuk menyimpan nilai "countdown"
