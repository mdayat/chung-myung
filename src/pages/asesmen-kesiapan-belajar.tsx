import { useCallback, useEffect, useState } from "react";
import { deleteDB, type IDBPDatabase } from "idb";

import {
  AssessmentHeader,
  AssessmentTimer,
  NavList,
} from "@components/AssessmentHeader";
import { AssessmentContent } from "@components/AssessmentContent";
import {
  putManyQuestion,
  putManySubtest,
  openAssessmentTrackerDB,
  type AssessmentTrackerDBSchema,
  type Subtest,
  type Question,
} from "@utils/assessmentTracker";
import { questionsDummyData, subtestsDummyData } from "../data/akb";

export default function AsesmenKesiapanBelajar() {
  const [timer, setTimer] = useState(0);
  const [indexedDB, setIndexedDB] =
    useState<IDBPDatabase<AssessmentTrackerDBSchema>>();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubtestCompleted, setIsSubtestCompleted] = useState(false);

  const [subtests, setSubtests] = useState<Subtest[]>([]);
  const [currentSubtestIndex, setCurrentSubtestIndex] = useState(0);

  const [currentSubtestQuestions, setCurrentSubtestQuestions] = useState<
    Question[]
  >([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const isLastSubtest = currentSubtestIndex === subtests.length - 1;
  const isLastQuestion =
    currentQuestionIndex === currentSubtestQuestions.length - 1;

  const handleAssessmentOnSubmit = useCallback(async () => {
    console.log(await indexedDB!.getAll("subtest"));
    console.log(await indexedDB!.getAll("question"));
  }, [indexedDB]);

  const handleSubtestOnSubmit = useCallback(async () => {
    try {
      // get questions from the server to replace "questionsDummyData",
      // based on the "currentSubtestIndex + 1"
      await putManyQuestion(
        questionsDummyData.slice(2, questionsDummyData.length),
        subtests[currentSubtestIndex + 1].id,
        indexedDB!
      );
      const storedQuestions = await indexedDB!.getAllFromIndex(
        "question",
        "subtestID",
        subtests[currentSubtestIndex + 1].id
      );
      // the "storedQuestions" must be sorted first
      setCurrentSubtestQuestions(storedQuestions);
      setCurrentQuestionIndex(0);
      setCurrentSubtestIndex(currentSubtestIndex + 1);
      setIsSubtestCompleted(true);
      setTimer(30);
    } catch (error) {
      // Log the error properly
      console.log(error);
    }
  }, [currentSubtestIndex, indexedDB, subtests]);

  function handleNextQuestionOnClick() {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  }

  function handlePrevQuestionOnClick() {
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  }

  // create countdown timer for assessment and rest area
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isSubtestCompleted) {
      timeout = setTimeout(() => {
        if (timer === 0) {
          // do something when times is up
        } else {
          setTimer(timer - 1);
        }
      }, 1000);
    } else {
      timeout = setTimeout(() => {
        if (timer === 0) {
          // do something when times is up
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
  }, [timer, subtests, currentSubtestIndex, indexedDB, isSubtestCompleted]);

  // check if indexedDB is supported or not, and
  // check whether the user continue (resume) their assessment or not
  useEffect(() => {
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
            setTimer(30);
          } else {
            const sortedSubtests = await db.getAllFromIndex(
              "subtest",
              "sequenceNumber"
            );
            setSubtests(sortedSubtests);

            let indexOfFirstSubtestWithNullTimer = 0;
            let indexOfLastSubtestWithTimer = 0;
            for (let i = 0; i < sortedSubtests.length; i++) {
              if (sortedSubtests[i].timer === null) {
                indexOfFirstSubtestWithNullTimer = i;
                indexOfLastSubtestWithTimer = i - 1;
                break;
              } else {
                indexOfLastSubtestWithTimer = i;
              }
            }

            const lastSubtestWithTimer =
              sortedSubtests[indexOfLastSubtestWithTimer];
            const questions = await db.getAllFromIndex(
              "question",
              "subtestID",
              lastSubtestWithTimer.id
            );

            let hasUnansweredAnswerChoice = false;
            for (let i = 0; i < questions.length; i++) {
              if (questions[i].answeredAnswerChoiceID === "") {
                hasUnansweredAnswerChoice = true;
                break;
              }
            }

            const hasUnsubmittedAssessment =
              hasUnansweredAnswerChoice === false &&
              indexOfFirstSubtestWithNullTimer === 0;

            if (hasUnansweredAnswerChoice || hasUnsubmittedAssessment) {
              setCurrentSubtestQuestions(questions);
              setCurrentSubtestIndex(indexOfLastSubtestWithTimer);
              setTimer(lastSubtestWithTimer.timer!);
            } else {
              const firstSubtestWithNullTimer =
                sortedSubtests[indexOfFirstSubtestWithNullTimer];
              setCurrentSubtestIndex(indexOfFirstSubtestWithNullTimer);

              // get questions from server to replace "questionsDummyData",
              // based on the current subtest (first subtest with null timer)
              await putManyQuestion(
                questionsDummyData.slice(2, questionsDummyData.length),
                firstSubtestWithNullTimer.id,
                db
              );
              const storedQuestions = await db.getAllFromIndex(
                "question",
                "subtestID",
                firstSubtestWithNullTimer.id
              );
              // the "storedQuestions" must be sorted first
              setCurrentSubtestQuestions(storedQuestions);
              setTimer(30);
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
      <div className="mt-20">
        <p>LOADING...</p>
      </div>
    );
  }

  if (isSubtestCompleted) {
    return (
      <div className="mt-20">
        <p>timer: {timer}</p>
        <h2>subtes selanjutnya: {subtests[currentSubtestIndex].name}</h2>
        <h2>jumlah soal: {currentSubtestQuestions.length}</h2>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <button
        onClick={() => {
          deleteDB("assessment-tracker");
        }}
      >
        Drop DB
      </button>

      <AssessmentHeader
        subtestsLength={subtests.length}
        currentSubtestIndex={currentSubtestIndex + 1}
        currentSubtestName={subtests[currentSubtestIndex].name}
      >
        <div className="bg-secondary-300 flex justify-between items-center">
          <NavList
            currentQuestionIndex={currentQuestionIndex}
            currentSubtestQuestions={currentSubtestQuestions}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
          />
          <AssessmentTimer currentSubtestTimer={timer} />
        </div>
      </AssessmentHeader>

      <AssessmentContent
        indexedDB={indexedDB!}
        currentQuestion={currentSubtestQuestions[currentQuestionIndex]}
        currentSubtestQuestions={currentSubtestQuestions}
        setCurrentSubtestQuestions={setCurrentSubtestQuestions}
      />

      <div className="flex justify-between items-center gap-x-8">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={handlePrevQuestionOnClick}
          type="button"
        >
          kembali
        </button>

        {isLastQuestion ? (
          <button
            disabled={isAllQuestionAnswered(currentSubtestQuestions) === false}
            onClick={
              isLastSubtest ? handleAssessmentOnSubmit : handleSubtestOnSubmit
            }
            type="button"
          >
            {isLastSubtest ? "selesaikan asesmen" : "selesaikan subtest"}
          </button>
        ) : (
          <button onClick={handleNextQuestionOnClick} type="button">
            selanjutnya
          </button>
        )}
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

// jika "timer" pada asesmen merupakan atribut pada subtes, misalnya "duration",
// maka perlu atribut lain untuk menyimpan nilai "countdown"
