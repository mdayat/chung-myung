import { openDB, type DBSchema, type IDBPDatabase } from "idb";

interface Subtest {
  id: string;
  name: string;
  sequenceNumber: number;
  timer: number | null;
}

interface AnswerChoice {
  id: string;
  isCorrectAnswer: boolean;
  content: string;
}

interface Question {
  id: string;
  subtestID: string;
  content: string;
  answeredAnswerChoiceID: string;
  multipleChoice: AnswerChoice[];
}

interface AssessmentTrackerDBSchema extends DBSchema {
  subtest: {
    value: Subtest;
    key: string;
    indexes: { sequenceNumber: number };
  };
  question: {
    value: Question;
    key: string;
    indexes: { subtestID: string };
  };
}

const DB_NAME = "assessment-tracker";
const DB_VERSION = 1;

async function openAssessmentTrackerDB(): Promise<
  IDBPDatabase<AssessmentTrackerDBSchema>
> {
  try {
    const db = await openDB<AssessmentTrackerDBSchema>(DB_NAME, DB_VERSION, {
      upgrade: (db) => {
        const subtestObjectStore = db.createObjectStore("subtest", {
          keyPath: "id",
        });
        subtestObjectStore.createIndex("sequenceNumber", "sequenceNumber");

        const questionObjectStore = db.createObjectStore("question", {
          keyPath: "id",
        });
        questionObjectStore.createIndex("subtestID", "subtestID");
      },
    });
    return db;
  } catch (error) {
    throw new Error("Failed when open IndexedDB: ", { cause: error });
  }
}

async function putManySubtest(
  subtests: Omit<Subtest, "timer">[],
  db: IDBPDatabase<AssessmentTrackerDBSchema>
) {
  const tx = db.transaction("subtest", "readwrite");
  try {
    await Promise.all(
      subtests.map((subtest) => {
        return tx.store.put({
          id: subtest.id,
          name: subtest.name,
          sequenceNumber: subtest.sequenceNumber,
          timer: null,
        });
      })
    );
  } catch (error) {
    throw new Error("Failed when put many subtest to object store: ", {
      cause: error,
    });
  }
}

async function putManyQuestion(
  questions: Omit<Question, "subtestID" | "answeredAnswerChoiceID">[],
  subtestID: string,
  db: IDBPDatabase<AssessmentTrackerDBSchema>
) {
  const tx = db.transaction("question", "readwrite");
  try {
    await Promise.all(
      questions.map((question) => {
        return tx.store.put({
          id: question.id,
          subtestID,
          content: question.content,
          answeredAnswerChoiceID: "",
          multipleChoice: question.multipleChoice,
        });
      })
    );
  } catch (error) {
    throw new Error("Failed when put many question to object store: ", {
      cause: error,
    });
  }
}

export { openAssessmentTrackerDB, putManySubtest, putManyQuestion };
export type { AssessmentTrackerDBSchema, Question, Subtest };