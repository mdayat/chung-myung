import type { SuccessResponse } from "@customTypes/api";
import type { Enums as DBEnums } from "@customTypes/database";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import { v4 as uuidv4 } from "uuid";

import type { AssessmentResult } from "../pages/api/users/[userID]/learning-journeys/[learningJourneyID]/assessment-results";

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

interface LearningMaterial {
  id: string;
  name: string;
  description: string;
  learningModuleURL: string;
  type: DBEnums<"learning_material_type">;
  sequenceNumber: number;
}

async function getSubtests(
  materialID: string,
  subtestType: "prerequisite" | "sub_material",
): Promise<Subtest[]> {
  try {
    const res = await fetch(`/api/materials/${materialID}/learning-materials`);
    const { data } = (await res.json()) as SuccessResponse<LearningMaterial[]>;

    const subtests: Subtest[] = new Array(data.length);
    if (data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].type !== subtestType) {
          continue;
        }

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

interface QuestionAPIResponse {
  id: string;
  content: string;
  explanation: string;
  taxonomyBloom: string;
  multipleChoice: { id: string; content: string; isCorrectAnswer: boolean }[];
}

async function getSubtestQuestions(
  materialID: string,
  subtestID: string,
): Promise<Question[]> {
  try {
    const res = await fetch(
      `/api/materials/${materialID}/learning-materials/${subtestID}/questions`,
    );
    const { data } = (await res.json()) as SuccessResponse<
      QuestionAPIResponse[]
    >;

    const questions: Question[] = new Array(data.length);
    if (data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
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

async function createAssessmentResult(
  db: IDBPDatabase<AssessmentTrackerDBSchema>,
  userID: string,
  learningJourneyID: string,
  assessmentType: "asesmen_kesiapan_belajar" | "asesmen_akhir",
) {
  try {
    const results = await Promise.all([
      await db.getAllFromIndex("subtest", "sequenceNumber"),
      await db.getAll("question"),
      await fetch(
        `/api/users/${userID}/learning-journeys/${learningJourneyID}/assessment-results`,
      ),
    ]);

    const sortedSubtests = results[0];
    const storedQuestions = results[1];

    const response = (await results[2].json()) as SuccessResponse<
      AssessmentResult[]
    >;
    let prevAssessmentResult: AssessmentResult | null = null;

    if (response.data.length !== 0) {
      for (let i = 0; i < response.data.length; i++) {
        const assessmentResult = response.data[i];
        if (assessmentResult.type === assessmentType) {
          prevAssessmentResult = assessmentResult;
          break;
        }
      }
    }

    if (prevAssessmentResult !== null) {
      await fetch(
        `/api/users/${userID}/learning-journeys/${learningJourneyID}/assessment-results/${prevAssessmentResult.id}`,
        {
          method: "DELETE",
        },
      );
    }

    const assessmentResult: Omit<AssessmentResult, "id" | "createdAt"> = {
      learningJourneyID,
      type: assessmentType,
      attempt:
        prevAssessmentResult === null ? 1 : prevAssessmentResult.attempt + 1,
      assessedLearningMaterials: sortedSubtests.map((subtest) => {
        const id = uuidv4();
        return {
          id,
          learningMaterialID: subtest.id,
          assessmentResponses: storedQuestions
            .filter((question) => question.subtestID === subtest.id)
            .map((question) => {
              let isCorrect = false;
              for (let i = 0; i < question.multipleChoice.length; i++) {
                if (
                  question.answeredAnswerChoiceID !==
                  question.multipleChoice[i].id
                ) {
                  continue;
                }

                if (question.multipleChoice[i].isCorrectAnswer) {
                  isCorrect = true;
                }
              }

              return {
                assessedLearningMaterialID: id,
                questionID: question.id,
                isCorrect,
              };
            }),
        };
      }),
    };

    await fetch(
      `/api/users/${userID}/learning-journeys/${learningJourneyID}/assessment-results`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentResult),
      },
    );
  } catch (error) {
    throw new Error("Error when create assessment result: ", {
      cause: error,
    });
  }
}

export {
  createAssessmentResult,
  getSubtestQuestions,
  getSubtests,
  openAssessmentTrackerDB,
  putManyQuestion,
  putManySubtest,
};
export type { AssessmentTrackerDBSchema, Question, Subtest };
