// TODO
// 1. Update to sudah dipelajari

import { CheckCircleIcon } from "@components/icons/CheckCircleIcon";
import { ChevronLeftIcon } from "@components/icons/ChevronLeftIcon";
import { LoaderSpinner } from "@components/icons/LoaderSpinner";
import { OpenInNewIcon } from "@components/icons/OpenInNewIcon";
import { WarningIcon } from "@components/icons/WarningIcon";
import { LearningMaterialCard } from "@components/LearningMaterialCard";
import { HelpMenu, Navbar, ProfileMenu } from "@components/Navbar";
import { Button } from "@components/shadcn/Button";
import { Typography } from "@components/shadcn/Typography";
import type { SuccessResponse } from "@customTypes/api";
import type { LearningJourney } from "@customTypes/learningJourney";
import { type LearningMaterial } from "@customTypes/learningMaterial";
import type { Material } from "@customTypes/material";
import MaskotHeadImage from "@public/maskot-head.png";
import { karla, nunito } from "@utils/fonts";
import axios, { type AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type ReactElement, useEffect, useMemo, useState } from "react";

import type { NextPageWithLayout } from "../../_app";

interface LearningMaterialWithStatus extends LearningMaterial {
  isStudied: boolean;
}

const USER_ID = "89168051-cd0d-4acf-8ce9-0fca8e3756d2";
const BelajarMateriDetail: NextPageWithLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLearningJourneyExist, setIsLearningJourneyExist] = useState(false);
  const [isLearningMaterialExist, setIsLearningMaterialExist] = useState(false);

  const [material, setMaterial] = useState<Omit<Material, "number">>({
    id: "",
    name: "",
    description: "",
  });

  const [learningMaterials, setLearningMaterials] = useState<
    LearningMaterialWithStatus[]
  >([]);

  const currentLearningMaterial = useMemo((): LearningMaterialWithStatus => {
    let learningMaterial: LearningMaterialWithStatus = {
      id: "",
      name: "",
      description: "",
      type: "prerequisite",
      number: 0,
      learningModuleURL: "",
      isStudied: false,
    };
    if (learningMaterials.length === 0 || router.isReady === false) {
      return learningMaterial;
    }

    const learningMaterialID = router.query.learningMaterialID;
    for (let i = 0; i < learningMaterials.length; i++) {
      if (learningMaterials[i].id !== learningMaterialID) continue;
      learningMaterial = {
        id: learningMaterials[i].name,
        name: learningMaterials[i].name,
        description: learningMaterials[i].description,
        type: learningMaterials[i].type,
        number: learningMaterials[i].number,
        learningModuleURL: learningMaterials[i].learningModuleURL,
        isStudied: learningMaterials[i].isStudied,
      };
    }
    return learningMaterial;
  }, [learningMaterials, router]);

  useEffect(() => {
    (async () => {
      try {
        // Get a learning journey based on "learningJourneyID"
        const learningJourneyID = window.location.pathname.split("/")[1];
        const { data: learningJourneyResponse } = await axios.get<
          SuccessResponse<LearningJourney>
        >(`/api/users/${USER_ID}/learning-journeys/${learningJourneyID}`);
        setIsLearningJourneyExist(true);

        // Check if "learningMaterialID" exist and mark the index
        let isExist = false;
        const splittedPathname = window.location.pathname.split("/");
        const learningMaterialID =
          splittedPathname[splittedPathname.length - 1];
        for (
          let i = 0;
          i < learningJourneyResponse.data.studiedLearningMaterials.length;
          i++
        ) {
          const studiedLearningMaterial =
            learningJourneyResponse.data.studiedLearningMaterials[i];
          if (
            learningMaterialID === studiedLearningMaterial.learningMaterialID
          ) {
            isExist = true;
            break;
          }
        }
        setIsLearningMaterialExist(isExist);

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

  if (isLearningJourneyExist === false || isLearningMaterialExist === false) {
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

      <div className='mx-auto mt-[84px] w-full max-w-[calc(1366px-256px)]'>
        <Link
          href={`/${window.location.pathname.split("/")[1]}/belajar-materi`}
          className='mb-6 flex h-fit w-fit items-center justify-start gap-x-2'
        >
          <ChevronLeftIcon className='h-6 w-6 fill-secondary-500' />
          <Typography className='text-secondary-500' variant='b3' weight='bold'>
            Kembali
          </Typography>
        </Link>

        <div className='mt-8 flex items-center gap-x-10'>
          <div className='relative shrink-0 overflow-hidden rounded-2xl'>
            {currentLearningMaterial.type === "prerequisite" ? (
              <div className='absolute flex items-center justify-between gap-x-2 rounded-br-2xl border-b border-r border-b-warning-500 border-r-warning-500 bg-warning-200 p-2.5'>
                <WarningIcon className='h-4 w-4 fill-warning-600' />
                <Typography
                  variant='b4'
                  weight='bold'
                  className='text-neutral-900'
                >
                  Materi Prasyarat
                </Typography>
              </div>
            ) : (
              <></>
            )}

            <Image
              src={MaskotHeadImage}
              alt={currentLearningMaterial.name}
              className='h-[180px] w-[320px] rounded-bl-2xl rounded-br-2xl bg-neutral-900 object-cover object-center'
            />

            <div className='mt-5 flex items-center justify-center gap-x-1'>
              {currentLearningMaterial.isStudied ? (
                <>
                  <CheckCircleIcon className='h-5 w-5 fill-success-600' />
                  <Typography variant='b4' className='text-success-600'>
                    Sudah dipelajari
                  </Typography>
                </>
              ) : (
                <Typography variant='b4' className='mx-auto'>
                  Belum dipelajari
                </Typography>
              )}
            </div>
          </div>

          <div>
            <Typography
              as='h2'
              variant='h6'
              weight='bold'
              className='mb-4 text-neutral-500'
            >
              Materi&nbsp;
              {currentLearningMaterial.type === "prerequisite"
                ? "Prasyarat"
                : "Sub-Materi"}
              &nbsp;
              {material.name}
            </Typography>

            <Typography
              as='h1'
              variant='h3'
              weight='bold'
              className='mb-3 text-neutral-700'
            >
              {currentLearningMaterial.name}
            </Typography>

            <Typography
              variant='b3'
              weight='normal'
              className='mb-6 max-w-[660px] text-neutral-500'
            >
              {currentLearningMaterial.description}
            </Typography>

            <Button asChild>
              <Link
                href={currentLearningMaterial.learningModuleURL}
                target='_blank'
                rel='noopener'
              >
                Baca Materi <OpenInNewIcon className='h-6 w-6' />
              </Link>
            </Button>
          </div>
        </div>

        <hr className='mt-6 text-neutral-300' />
        <Typography as='h2' variant='h5' weight='bold' className='my-8'>
          Pelajari materi lainnya!
        </Typography>

        <div className='flex flex-wrap items-center justify-center gap-8'>
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
      </div>
    </>
  );
};

function sortLearningMaterialByType(
  learningMaterials: LearningMaterialWithStatus[],
): LearningMaterialWithStatus[] {
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

BelajarMateriDetail.getLayout = function getLayout(page: ReactElement) {
  return (
    <main className={`${karla.variable} ${nunito.variable} font-karla`}>
      {page}
    </main>
  );
};

export default BelajarMateriDetail;
