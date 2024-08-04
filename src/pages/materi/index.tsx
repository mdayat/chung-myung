import { ChevronLeftIcon } from "@components/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@components/icons/ChevronRightIcon";
import { LoaderSpinner } from "@components/icons/LoaderSpinner";
import { MateriCard } from "@components/MateriCard";
import { Typography } from "@components/shadcn/Typography";
import { FailedResponse, SuccessResponse } from "@customTypes/api";
import maskotHead from "@public/maskot-head.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import type { NextPageWithLayout } from "../_app";

interface LearningMaterial {
  id: string;
  name: string;
  description: string;
  learningModuleURL: string;
  type: "prerequisite" | "sub_material";
  number: number;
}

const Materi: NextPageWithLayout = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [learningMaterials, setLearningMaterials] = useState<
    LearningMaterial[]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    (async () => {
      try {
        const materialID = "f64fb490-778d-4719-8d01-18f49a3b55a4";
        // ENV Disesuaikan Dengan Port Masing2 Dev
        const learningMaterialsResponse = (await (
          await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}api/materials/${materialID}/learning-materials`,
          )
        ).json()) as SuccessResponse<LearningMaterial[]> | FailedResponse;

        if (learningMaterialsResponse.status === "failed") {
          // do something when failed
          return;
        }

        setLearningMaterials(learningMaterialsResponse.data);
      } catch (error) {
        console.error(
          new Error(
            "Error when get all learning materials based on material ID: ",
            { cause: error },
          ),
        );
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
  return (
    <>
      <div className='relative mt-5 flex h-[230px] w-full flex-col overflow-clip bg-secondary-500 px-16 py-14'>
        <div className='z-0'>
          <div className='absolute -right-10 -top-20 h-[548px] w-[536px] overflow-clip rounded-full bg-secondary-600' />
          <div className='absolute -right-10 -top-28 z-10 h-[606px] w-[596px] overflow-clip rounded-full bg-secondary-600 opacity-60' />
        </div>
        <div onClick={router.back} className='flex hover:cursor-pointer'>
          <ChevronLeftIcon className='mb-5 h-5 w-5 fill-secondary-50 text-secondary-50' />
          <Typography className='text-neutral-25' variant='b3' weight='bold'>
            Kembali
          </Typography>
        </div>

        <div className='flex w-full justify-between'>
          <section>
            <div className='flex'>
              <Image src={maskotHead} alt='Hehe' width={100} height={100} />
              <div className='ml-3'>
                <Typography
                  className='mt-3 text-neutral-25'
                  variant='h3'
                  weight='bold'
                >
                  Bidang Ruang
                </Typography>
                <Typography
                  className='mt-3 text-neutral-200'
                  variant='b3'
                  weight='bold'
                >
                  Kelas 12 - Kurikulum K13
                </Typography>
              </div>
            </div>
          </section>
          <section className='z-30 my-5'>
            <div className='flex w-full justify-end'>
              <Typography
                className='mb-5 flex w-fit rounded-full bg-neutral-300 p-2 text-neutral-100'
                variant='b3'
                weight='bold'
              >
                Assesmen Akhir
                <ChevronRightIcon className='fill h-5 w-5 fill-neutral-100' />
              </Typography>
            </div>

            <div className='flex'>
              <div className='mr-2 mt-1.5 h-2 w-[300px] rounded-full bg-neutral-900'>
                <div className='h-2 w-[100px] rounded-full bg-success-500'></div>
              </div>

              <Typography
                variant='b3'
                weight='bold'
                className='text-neutral-100'
              >
                100%
              </Typography>
            </div>
          </section>
        </div>
      </div>

      <div className='my-4 flex flex-wrap gap-4 px-16'>
        {!isLoading && learningMaterials ? (
          learningMaterials?.map((data: LearningMaterial) => (
            <Link
              key={data.id}
              href={{
                pathname: `materi/${data.id}`,
              }}
            >
              <MateriCard name={data.name} type={data.type} />
            </Link>
          ))
        ) : (
          <div className='mt-10 flex w-full justify-center'>
            <LoaderSpinner className='h-16 w-16' />
          </div>
        )}
      </div>
    </>
  );
};

export default Materi;
