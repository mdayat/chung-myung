import type { SuccessResponse } from "@customTypes/api";
import type { AssessmentResult } from "@customTypes/assessmentResult";
import type { LearningMaterial } from "@customTypes/learningMaterial";
import type { Question } from "@customTypes/question";
import { type DBSchema, type IDBPDatabase, openDB } from "idb";
import { v4 as uuidv4 } from "uuid";

type AssessedLearningMaterial = Pick<
  LearningMaterial,
  "id" | "name" | "number"
> & {
  isSubmitted: boolean;
};

type AssessmentResponse = Pick<
  Question,
  "id" | "content" | "multipleChoice"
> & {
  subtestID: string;
  selectedChoiceID: string;
};

interface AssessmentTrackerDBSchema extends DBSchema {
  assessmentTimer: {
    key: "timer";
    value: number;
  };
  subtest: {
    value: AssessedLearningMaterial;
    key: string;
    indexes: { number: number };
  };
  question: {
    value: AssessmentResponse;
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
        subtestObjectStore.createIndex("number", "number");

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
  subtests: Omit<AssessedLearningMaterial, "isSubmitted">[],
  db: IDBPDatabase<AssessmentTrackerDBSchema>,
) {
  const tx = db.transaction("subtest", "readwrite");
  try {
    await Promise.all(
      subtests.map((subtest) => {
        return tx.store.put({
          id: subtest.id,
          name: subtest.name,
          number: subtest.number,
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
  questions: Omit<AssessmentResponse, "selectedChoiceID" | "subtestID">[],
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
          multipleChoice: question.multipleChoice,
          selectedChoiceID: "",
        });
      }),
    );
  } catch (error) {
    throw new Error("Failed when put many question to object store: ", {
      cause: error,
    });
  }
}

async function getSubtests(
  materialID: string,
  subtestType: "prerequisite" | "sub_material",
): Promise<AssessedLearningMaterial[]> {
  try {
    const res = await fetch(`/api/materials/${materialID}/learning-materials`);
    const { data } = (await res.json()) as SuccessResponse<LearningMaterial[]>;

    const subtests: AssessedLearningMaterial[] = new Array(data.length);
    if (data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].type !== subtestType) {
          continue;
        }

        subtests[i] = {
          id: data[i].id,
          name: data[i].name,
          number: data[i].number,
          isSubmitted: false,
        };
      }
    }

    return subtests;
  } catch (error) {
    throw new Error("Error when get subtests: ", { cause: error });
  }
}

async function getSubtestQuestions(
  materialID: string,
  subtestID: string,
): Promise<AssessmentResponse[]> {
  try {
    const res = await fetch(
      `/api/materials/${materialID}/learning-materials/${subtestID}/questions`,
    );
    const { data } = (await res.json()) as SuccessResponse<Question[]>;

    const questions: AssessmentResponse[] = new Array(data.length);
    if (data.length !== 0) {
      for (let i = 0; i < data.length; i++) {
        questions[i] = {
          id: data[i].id,
          content: data[i].content,
          multipleChoice: data[i].multipleChoice,
          selectedChoiceID: "",
          subtestID,
        };
      }
    }

    return questions;
  } catch (error) {
    throw new Error("Error when get all subtest questions: ", { cause: error });
  }
}

interface AssessmentResultCreation
  extends Omit<AssessmentResult, "id" | "createdAt"> {
  assessedLearningMaterials: {
    id: string;
    learningMaterialID: string;
    assessmentResponses: {
      assessedLearningMaterialID: string;
      questionID: string;
      isCorrect: boolean;
    }[];
  }[];
}

async function createAssessmentResult(
  db: IDBPDatabase<AssessmentTrackerDBSchema>,
  userID: string,
  learningJourneyID: string,
  assessmentType: "asesmen_kesiapan_belajar" | "asesmen_akhir",
) {
  try {
    const results = await Promise.all([
      await db.getAllFromIndex("subtest", "number"),
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

    const unmasteredLearningMaterialIDs: string[] = [];
    const assessmentResult: AssessmentResultCreation = {
      type: assessmentType,
      attempt:
        prevAssessmentResult === null ? 1 : prevAssessmentResult.attempt + 1,
      assessedLearningMaterials: sortedSubtests.map((subtest) => {
        let isUnmastered = false;
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
                  question.selectedChoiceID !== question.multipleChoice[i].id
                ) {
                  continue;
                }

                if (question.multipleChoice[i].isCorrect) {
                  isCorrect = true;
                }
              }

              if (isUnmastered === false && isCorrect === false) {
                unmasteredLearningMaterialIDs.push(subtest.id);
                isUnmastered = true;
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

    if (
      assessmentResult.attempt === 3 &&
      assessmentType === "asesmen_kesiapan_belajar"
    ) {
      Promise.all([
        fetch(
          `/api/users/${userID}/learning-journeys/${learningJourneyID}/assessment-results`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assessmentResult),
          },
        ),
        fetch(`/api/users/${userID}/learning-journeys/${learningJourneyID}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prerequisiteIDs: unmasteredLearningMaterialIDs,
          }),
        }),
      ]);
    }

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
export type {
  AssessedLearningMaterial,
  AssessmentResponse,
  AssessmentTrackerDBSchema,
};
