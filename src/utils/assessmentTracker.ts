import { type DBSchema, type IDBPDatabase, openDB } from "idb";

interface Subtest {
  id: string;
  name: string;
  sequenceNumber: number;
  isSubmitted: boolean;
}

interface AnswerChoice {
  id: string;
  content: string;
  isCorrectAnswer: boolean;
}

interface Question {
  id: string;
  subtestID: string;
  content: string;
  answeredAnswerChoiceID: string;
  multipleChoice: AnswerChoice[];
}

interface AssessmentTrackerDBSchema extends DBSchema {
  assessmentTimer: {
    key: "timer";
    value: number;
  };
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
        db.createObjectStore("assessmentTimer");

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
  subtests: Omit<Subtest, "isSubmitted">[],
  db: IDBPDatabase<AssessmentTrackerDBSchema>,
) {
  const tx = db.transaction("subtest", "readwrite");
  try {
    await Promise.all(
      subtests.map((subtest) => {
        return tx.store.put({
          id: subtest.id,
          name: subtest.name,
          sequenceNumber: subtest.sequenceNumber,
          isSubmitted: false,
        });
      }),
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
  db: IDBPDatabase<AssessmentTrackerDBSchema>,
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
      }),
    );
  } catch (error) {
    throw new Error("Failed when put many question to object store: ", {
      cause: error,
    });
  }
}

const MATERIAL_ID = "f64fb490-778d-4719-8d01-18f49a3b55a4";

async function getSubtestQuestions(
  subtestID: string,
  subtestType: "prerequisite" | "sub_material",
): Promise<Question[]> {
  try {
    const res = await fetch(
      `/api/materials/${MATERIAL_ID}/${subtestType.split("_").join("-") + "s"}/${subtestID}/questions`,
    );
    const { data } = await res.json();
    const questions: Question[] = new Array(data.length);
    if (questions.length !== 0) {
      for (let i = 0; i < questions.length; i++) {
        questions[i] = {
          id: data[i].id,
          content: data[i].content,
          multipleChoice: data[i].multipleChoice,
          answeredAnswerChoiceID: "",
          subtestID,
        };
      }
    }

    return questions;
  } catch (error) {
    throw new Error("Error when get all subtest questions: ", { cause: error });
  }
}

async function getSubtests(
  subtestType: "prerequisite" | "sub_material",
): Promise<Subtest[]> {
  try {
    const res = await fetch(
      `/api/materials/${MATERIAL_ID}/${subtestType.split("_").join("-") + "s"}`,
    );
    const { data } = await res.json();
    const subtests: Subtest[] = new Array(data.length);
    if (subtests.length !== 0) {
      for (let i = 0; i < subtests.length; i++) {
        subtests[i] = {
          id: data[i].id,
          name: data[i].name,
          sequenceNumber: data[i].sequenceNumber,
          isSubmitted: false,
        };
      }
    }

    return subtests;
  } catch (error) {
    throw new Error("Error when get subtests: ", { cause: error });
  }
}

export {
  getSubtestQuestions,
  getSubtests,
  openAssessmentTrackerDB,
  putManyQuestion,
  putManySubtest,
};
export type { AssessmentTrackerDBSchema, Question, Subtest };
