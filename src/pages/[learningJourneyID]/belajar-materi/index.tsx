import { BelajarMateriHeader } from "@components/BelajarMateriHeader";
import { LoaderSpinner } from "@components/icons/LoaderSpinner";
import { LearningMaterialCard } from "@components/LearningMaterialCard";
import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";
import { Typography } from "@components/shadcn/Typography";
import type { SuccessResponse } from "@customTypes/api";
import type { LearningJourney } from "@customTypes/learningJourney";
import { type LearningMaterial } from "@customTypes/learningMaterial";
import type { Material } from "@customTypes/material";
import { karla, nunito } from "@utils/fonts";
import axios, { type AxiosError } from "axios";
import { type ReactElement, useEffect, useMemo, useState } from "react";

import type { NextPageWithLayout } from "../../_app";

interface LearningMaterialWithStatus extends LearningMaterial {
  isStudied: boolean;
}

const USER_ID = "89168051-cd0d-4acf-8ce9-0fca8e3756d2";
const BelajarMateri: NextPageWithLayout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLearningJourneyExist, setIsLearningJourneyExist] = useState(false);

  const [material, setMaterial] = useState<Omit<Material, "number">>({
    id: "",
    name: "",
    description: "",
  });

  const [learningMaterials, setLearningMaterials] = useState<
    LearningMaterialWithStatus[]
  >([]);

  useEffect(() => {
    const learningJourneyID = window.location.pathname.split("/")[1];
    (async () => {
      try {
        // Get a learning journey based on "learningJourneyID"
        const { data: learningJourneyResponse } = await axios.get<
          SuccessResponse<LearningJourney>
        >(`/api/users/${USER_ID}/learning-journeys/${learningJourneyID}`);
        setIsLearningJourneyExist(true);

        // Get a material and learning materials based on learning journey data
        const responses = await Promise.all([
          axios.get<SuccessResponse<Omit<Material, "number">>>(
            `/api/materials/${learningJourneyResponse.data.materialID}`,
          ),
          ...learningJourneyResponse.data.studiedLearningMaterials.map(
            ({ learningMaterialID }) =>
              axios.get<SuccessResponse<LearningMaterialWithStatus>>(
                `/api/materials/${learningJourneyResponse.data.materialID}/learning-materials/${learningMaterialID}`,
              ),
          ),
        ]);

        const learningMaterialsWithStatus: LearningMaterialWithStatus[] =
          new Array(responses.length - 1);

        learningMaterialsLoop: for (let i = 1; i < responses.length; i++) {
          const learningMaterial = responses[i].data
            .data as LearningMaterialWithStatus;

          for (const studiedLearningMaterial of learningJourneyResponse.data
            .studiedLearningMaterials) {
            if (
              studiedLearningMaterial.learningMaterialID !== learningMaterial.id
            )
              continue;

            learningMaterialsWithStatus[i - 1] = {
              id: learningMaterial.id,
              name: learningMaterial.name,
              description: learningMaterial.description,
              type: learningMaterial.type,
              number: learningMaterial.number,
              learningModuleURL: learningMaterial.learningModuleURL,
              isStudied: studiedLearningMaterial.isStudied,
            };
            continue learningMaterialsLoop;
          }
        }

        setMaterial({ ...responses[0].data.data });
        setLearningMaterials(learningMaterialsWithStatus);
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
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const totalStudiedLearningMaterials = useMemo((): number => {
    let num = 0;
    for (const { isStudied } of learningMaterials) {
      if (isStudied === false) continue;
      num++;
    }
    return num;
  }, [learningMaterials]);

  if (isLoading) {
    return (
      <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center'>
        <LoaderSpinner className='mb-6 h-16 w-16' />
        <Typography as='h2' variant='h5' weight='bold' className='mb-2'>
          Tunggu sebentar ya!
        </Typography>
      </div>
    );
  }

  if (isLearningJourneyExist === false) {
    return (
      <div className='absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center'>
        <Typography
          as='h1'
          variant='d1'
          weight='bold'
          className='mb-2 text-secondary-500'
        >
          404
        </Typography>
        <Typography as='h2' variant='h5' weight='bold'>
          Page Not Found!
        </Typography>
      </div>
    );
  }

  return (
    <>
      <Navbar bgColor='bg-neutral-100'>
        <HelpMenu />
        <ProfileMenu withIcon withUsername />
      </Navbar>

      <BelajarMateriHeader
        materialName={material.name}
        totalLearningMaterials={learningMaterials.length}
        totalStudiedLearningMaterials={totalStudiedLearningMaterials}
      />

      <div className='mx-auto mt-8 flex w-full max-w-[calc(1366px-256px)] flex-wrap items-center justify-center gap-8 pb-8'>
        {sortLearningMaterialByType(learningMaterials).map(
          (learningMaterial) => {
            return (
              <LearningMaterialCard
                key={learningMaterial.id}
                id={learningMaterial.id}
                name={learningMaterial.name}
                type={learningMaterial.type}
                learningModuleURL={learningMaterial.learningModuleURL}
                isStudied={learningMaterial.isStudied}
              />
            );
          },
        )}
      </div>
    </>
  );
};

function sortLearningMaterialByType(
  learningMaterials: LearningMaterialWithStatus[],
) {
  const sortedLearningMaterials: LearningMaterialWithStatus[] = [];
  for (const learningMaterial of learningMaterials) {
    if (learningMaterial.type === "prerequisite") {
      sortedLearningMaterials.unshift(learningMaterial);
    } else {
      sortedLearningMaterials.push(learningMaterial);
    }
  }
  return sortedLearningMaterials;
}

BelajarMateri.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} mt-16 font-karla`}>
      {page}
    </main>
  );
};

export default BelajarMateri;
