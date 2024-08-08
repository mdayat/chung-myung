import { CheckboxIcon } from "@components/icons/CheckboxIcon";
import { CheckboxOutlineBlankIcon } from "@components/icons/CheckboxOutlineBlankIcon";
import { Button } from "@components/shadcn/Button";
import {
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@components/shadcn/Dialog";
import { Typography } from "@components/shadcn/Typography";
import type { SuccessResponse } from "@customTypes/api";
import type { AssessmentTrackerDBSchema } from "@utils/assessmentTracker";
import axios, { type AxiosError } from "axios";
import type { IDBPDatabase } from "idb";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface AssessmentRulesPopupProps {
  indexedDB: IDBPDatabase<AssessmentTrackerDBSchema>;
}

const USER_ID = "89168051-cd0d-4acf-8ce9-0fca8e3756d2";
const MATERIAL_ID = "f64fb490-778d-4719-8d01-18f49a3b55a4";

export function AssessmentRulesPopup({ indexedDB }: AssessmentRulesPopupProps) {
  const [isChecked, setIsChecked] = useState(false);

  function toggleAssessmentRules() {
    setIsChecked(!isChecked);
  }

  async function startAssessment() {
    let learningJourneyID = "";
    try {
      const { data: learningJourneyIDResponse } = await axios.post<
        SuccessResponse<{ learningJourneyID: string }>
      >(
        `/api/users/${USER_ID}/learning-journeys`,
        { materialID: MATERIAL_ID },
        { headers: { "Content-Type": "application/json" } },
      );
      learningJourneyID = learningJourneyIDResponse.data.learningJourneyID;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        // retry the request
      } else if (error.request) {
        // retry the request
      } else {
        console.error(
          new Error("Something is wrong with Axios: ", { cause: error }),
        );
      }
      return;
    }

    try {
      const assessmentID = uuidv4();
      await indexedDB.put("assessmentDetail", {
        id: assessmentID,
        type: "asesmen_kesiapan_belajar",
        timer: 0,
      });

      window.location.replace(
        `${window.location.origin}/${learningJourneyID}/asesmen/${assessmentID}`,
      );
    } catch (error) {
      console.error(
        new Error("Error when create a ticket for asesmen kesiapan belajar: ", {
          cause: error,
        }),
      );
    }
  }

  return (
    <>
      <DialogTitle asChild>
        <Typography
          as='h3'
          variant='h5'
          weight='bold'
          className='mb-2 text-neutral-700'
        >
          Peraturan Asesmen
        </Typography>
      </DialogTitle>

      <DialogDescription asChild>
        <Typography variant='b3' className='mb-6 text-neutral-500'>
          Pastikan kamu membaca seluruh peraturan asesmen ini.
        </Typography>
      </DialogDescription>

      <ol className='mb-4 ml-6 list-decimal'>
        <li>
          <Typography variant='b3' className='text-neutral-500'>
            Kamu memiliki 3 kali kesempatan untuk mengerjakan asesmen ini.
          </Typography>
        </li>
        <li>
          <Typography variant='b3' className='text-neutral-500'>
            Kerjakan dengan jujur agar hasilnya benar-benar mencerminkan
            pemahaman kamu.
          </Typography>
        </li>
      </ol>

      <button
        onClick={toggleAssessmentRules}
        type='button'
        className='mb-6 flex items-center gap-x-1.5'
      >
        {isChecked ? (
          <CheckboxIcon className='h-5 w-5 fill-secondary-600' />
        ) : (
          <CheckboxOutlineBlankIcon className='h-5 w-5' />
        )}

        <Typography variant='b3' className='text-neutral-500'>
          Saya sudah membaca peraturan asesmen.
        </Typography>
      </button>

      <DialogFooter>
        <Button
          onClick={startAssessment}
          disabled={isChecked === false}
          className='block w-full text-center'
        >
          Mulai Asesmen
        </Button>
      </DialogFooter>
    </>
  );
}
