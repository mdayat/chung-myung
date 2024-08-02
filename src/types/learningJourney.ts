import { z as zod } from "zod";

const studiedLearningMaterialSchema = zod.object({
  learningMaterialID: zod.string().uuid(),
  isStudied: zod.boolean(),
});

const learningJourneySchema = zod.object({
  id: zod.string().uuid(),
  userID: zod.string().uuid(),
  materialID: zod.string().uuid(),
  studiedLearningMaterials: zod.array(studiedLearningMaterialSchema),
});
type LearningJourney = zod.infer<typeof learningJourneySchema>;

export { learningJourneySchema };
export type { LearningJourney };
