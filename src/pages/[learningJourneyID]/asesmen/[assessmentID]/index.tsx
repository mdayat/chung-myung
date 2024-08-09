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
  type AssessedLearningMaterial,
  type AssessmentDetail,
  type AssessmentResponse,
  type AssessmentTrackerDBSchema,
  createAKBResult,
  createAsesmenAkhirResult,
  getSubtestQuestions,
  getSubtests,
  openAssessmentTrackerDB,
  putManyQuestion,
  putManySubtest,
} from "@utils/assessmentTracker";
import { karla, nunito } from "@utils/fonts";
import { type IDBPDatabase } from "idb";
import Image from "next/image";
import { useRouter } from "next/router";
import { type ReactElement, useCallback, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../../_app";

const assessmentFooterID = "assessment-footer";
const Asesmen: NextPageWithLayout = () => {
  const router = useRouter();
  const [timer, setTimer] = useState<number | null>(null);
  const [indexedDB, setIndexedDB] =
    useState<IDBPDatabase<AssessmentTrackerDBSchema>>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubtestFinished, setIsSubtestFinished] = useState(false);
  const [isAssessmentTimeout, setIsAssessmentTimeout] = useState(false);

  const [subtests, setSubtests] = useState<AssessedLearningMaterial[]>([]);
  const [currentSubtestIndex, setCurrentSubtestIndex] = useState(0);

  const [currentSubtestQuestions, setCurrentSubtestQuestions] = useState<
    AssessmentResponse[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [assessmentDetail, setAssessmentDetail] = useState<
    Pick<AssessmentDetail, "materialID" | "type" | "learningJourneyID">
  >({
    learningJourneyID: "",
    materialID: "",
    type: "asesmen_kesiapan_belajar",
  });

  const isLastQuestion =
    currentQuestionIndex === currentSubtestQuestions.length - 1;

  const handleSubmitSubtest = useCallback(async () => {
    try {
      const isLastSubtest = subtests.length - 1 === currentSubtestIndex;
      if (isLastSubtest) {
        if (assessmentDetail.type === "asesmen_kesiapan_belajar") {
          await createAKBResult(indexedDB!, assessmentDetail.learningJourneyID);
        } else {
          await createAsesmenAkhirResult(
            indexedDB!,
            assessmentDetail.learningJourneyID,
          );
        }

        // Promise.all([
        //   await indexedDB!.clear("subtest"),
        //   await indexedDB!.clear("question"),
        //   await indexedDB!.clear("assessmentDetail"),
        // ]);
        // router.replace(window.location.origin);
      } else {
        const currentSubtest = subtests[currentSubtestIndex];
        const nextSubtestQuestions = await getSubtestQuestions(
          assessmentDetail.materialID,
          subtests[currentSubtestIndex + 1].id,
        );

        await Promise.all([
          putManyQuestion(
            nextSubtestQuestions,
            subtests[currentSubtestIndex + 1].id,
            indexedDB!,
          ),
          indexedDB!.put("subtest", {
            ...currentSubtest,
            isSubmitted: true,
          }),
        ]);

        const storedQuestions = await indexedDB!.getAllFromIndex(
          "question",
          "subtestID",
          subtests[currentSubtestIndex + 1].id,
        );
        setCurrentSubtestQuestions(storedQuestions);

        setCurrentSubtestIndex(currentSubtestIndex + 1);
        setCurrentQuestionIndex(0);
        setIsSubtestFinished(true);
        setTimer(20);
      }
    } catch (error) {
      console.error(error);
    }
  }, [indexedDB, subtests, currentSubtestIndex, assessmentDetail, router]);

  function handleClickNextQuestion() {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handleClickPrevQuestion() {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }

  const handleClickNextSubtest = useCallback(async () => {
    try {
      const assessmentDetail = await indexedDB!.get(
        "assessmentDetail",
        getAssessmentIDFromURL(),
      );
      setTimer(assessmentDetail!.timer ?? 0);
      setIsSubtestFinished(false);
    } catch (error) {
      console.error(error);
    }
  }, [indexedDB]);

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
      if (timer === 0) {
        handleClickNextSubtest();
      } else {
        timeout = setTimeout(() => {
          setTimer(timer! - 1);
        }, 1000);
      }
    }

    // Decrease the timer for popup (the popup is displayed when the subtest time is up), and
    // show "RestArea" when the timer is up.
    if (isAssessmentTimeout) {
      if (timer === 0) {
        router.replace(window.location.origin);
      } else {
        timeout = setTimeout(() => {
          setTimer(timer! - 1);
        }, 1000);
      }
    }

    // Decrease the timer for subtest with optimistic update and update it on indexedDB.
    // Show a popup when the timer is up and save it to supabase.
    if (isSubtestFinished === false && isAssessmentTimeout === false) {
      if (timer === 0) {
        setIsAssessmentTimeout(true);
        setTimer(5);

        (async () => {
          try {
            if (assessmentDetail.type === "asesmen_kesiapan_belajar") {
              await createAKBResult(
                indexedDB!,
                assessmentDetail.learningJourneyID,
              );
            } else {
              await createAsesmenAkhirResult(
                indexedDB!,
                assessmentDetail.learningJourneyID,
              );
            }

            Promise.all([
              await indexedDB!.clear("subtest"),
              await indexedDB!.clear("question"),
              await indexedDB!.clear("assessmentDetail"),
            ]);
          } catch (error) {
            console.error(error);
          }
        })();
      } else {
        timeout = setTimeout(() => {
          setTimer(timer! - 1);
          (async () => {
            try {
              // Update timer value
              const assessmentDetail = await indexedDB!.get(
                "assessmentDetail",
                getAssessmentIDFromURL(),
              );
              await indexedDB!.put("assessmentDetail", {
                ...assessmentDetail!,
                timer: assessmentDetail!.timer! - 1,
              });
            } catch (error) {
              setTimer(timer! + 1);
              console.error(error);
            }
          })();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [
    indexedDB,
    isAssessmentTimeout,
    isSubtestFinished,
    timer,
    assessmentDetail,
    router,
    handleClickNextSubtest,
  ]);

  useEffect(() => {
    if (router.isReady === false) return;

    (async () => {
      if ("indexedDB" in window === false) {
        alert("your browser doesn't support indexedDB");
      } else {
        try {
          const db = await openAssessmentTrackerDB();
          setIndexedDB(db);

          // Check if "assessmentID" and "learningJourneyID" form URL are match with indexeddb
          const assessmentID = getAssessmentIDFromURL();
          const learningJourneyID = window.location.pathname.split("/")[1];
          const assessmentDetail = await db.get(
            "assessmentDetail",
            assessmentID,
          );
          if (
            assessmentDetail === undefined ||
            learningJourneyID !== assessmentDetail.learningJourneyID
          ) {
            router.replace(window.location.origin);
            return;
          }

          setAssessmentDetail({
            learningJourneyID,
            materialID: assessmentDetail.materialID,
            type: assessmentDetail.type,
          });

          // Check if user has unfinished assessment or not
          const subtests = await db.getAll("subtest");
          if (subtests.length === 0) {
            // Set timer value
            await db.put("assessmentDetail", {
              ...assessmentDetail!,
              timer: 356400,
            });
            setTimer(356400);

            const prerequisites = await getSubtests(
              assessmentDetail.materialID,
              assessmentDetail!.type === "asesmen_kesiapan_belajar"
                ? "prerequisite"
                : "sub_material",
            );
            await putManySubtest(prerequisites, db);

            const sortedSubtests = await db.getAllFromIndex(
              "subtest",
              "number",
            );
            setSubtests(sortedSubtests);

            const subtestQuestions = await getSubtestQuestions(
              assessmentDetail.materialID,
              sortedSubtests[0].id,
            );
            await putManyQuestion(subtestQuestions, sortedSubtests[0].id, db);

            const storedQuestions = await db.getAllFromIndex(
              "question",
              "subtestID",
              sortedSubtests[0].id,
            );
            setCurrentSubtestQuestions(storedQuestions);
          } else {
            setTimer(assessmentDetail?.timer ?? 0);
            const sortedSubtests = await db.getAllFromIndex(
              "subtest",
              "number",
            );
            setSubtests(sortedSubtests);

            let unsubmittedSubtestIndex = 0;
            for (let i = 0; i < sortedSubtests.length; i++) {
              if (sortedSubtests[i].isSubmitted === false) {
                unsubmittedSubtestIndex = i;
                break;
              }
            }
            setCurrentSubtestIndex(unsubmittedSubtestIndex);
            const currentSubtest = sortedSubtests[unsubmittedSubtestIndex];

            const storedQuestions = await db.getAllFromIndex(
              "question",
              "subtestID",
              currentSubtest.id,
            );
            if (storedQuestions.length !== 0) {
              setCurrentSubtestQuestions(storedQuestions);
            } else {
              const subtestQuestions = await getSubtestQuestions(
                assessmentDetail.materialID,
                currentSubtest.id,
              );
              await putManyQuestion(subtestQuestions, currentSubtest.id, db);

              const storedQuestions = await db.getAllFromIndex(
                "question",
                "subtestID",
                currentSubtest.id,
              );
              setCurrentSubtestQuestions(storedQuestions);
            }
          }
          setIsLoading(false);
        } catch (error) {
          // Log the error properly
          console.error(error);
        }
      }
    })();
  }, [router]);

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
          assessmentType={assessmentDetail.type}
          handleClickNextSubtest={handleClickNextSubtest}
          timer={timer!}
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

      <div className='mx-auto mt-[calc(64px+32px)] w-full max-w-[calc(1366px-160px)] pb-8'>
        <AssessmentHeader
          assessmentType={assessmentDetail.type}
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
              currentSubtestTimer={isAssessmentTimeout ? 0 : timer!}
            />
          </div>
        </AssessmentHeader>

        <AssessmentContent
          assessmentFooterID={assessmentFooterID}
          indexedDB={indexedDB!}
          currentQuestion={currentSubtestQuestions[currentQuestionIndex]}
          currentSubtestQuestions={currentSubtestQuestions}
          setCurrentSubtestQuestions={setCurrentSubtestQuestions}
        />

        <div
          id={assessmentFooterID}
          className='mt-8 flex items-center justify-end gap-x-8 opacity-0'
        >
          <Button
            onClick={handleClickPrevQuestion}
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
                onClick={handleClickNextQuestion}
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
                    onClick={handleSubmitSubtest}
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
            onOpenChange={() => router.replace(window.location.origin)}
          >
            <DialogContent>
              <TimeIsUpPopup timer={timer!} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};

function isAllQuestionAnswered(questions: AssessmentResponse[]): boolean {
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].selectedChoiceID === "") {
      return false;
    }
  }
  return true;
}

interface TimeIsUpPopupProps {
  timer: number;
}

function TimeIsUpPopup({ timer }: TimeIsUpPopupProps) {
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
              Kamu akan diarahkan ke halaman hasil asesmen&nbsp;
              <span className='text-secondary-500'>{timer} detik</span>.
            </Typography>
          </>
        </DialogDescription>
      </DialogHeader>
    </>
  );
}

function getAssessmentIDFromURL(): string {
  const splittedURL = window.location.pathname.split("/");
  return splittedURL[splittedURL.length - 1];
}

Asesmen.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} font-karla`}>
      {page}
    </main>
  );
};

export default Asesmen;
