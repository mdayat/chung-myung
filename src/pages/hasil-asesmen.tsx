import { AssessmentResultContent } from "@components/AssessmentResultContent";
import { AssessmentResultProfileCard } from "@components/AssessmentResultProfileCard";

const assessmentResultProfileData = {};
const assessmentResultContentData = {};

export default function HasilAsesmen() {
  console.log(assessmentResultContentData);
  console.log(assessmentResultProfileData);
  return (
    <>
      <AssessmentResultProfileCard />
      <AssessmentResultContent />
    </>
  );
}
