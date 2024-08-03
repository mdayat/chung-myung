import { z as zod } from "zod";

const learningMaterialSchema = zod.object({
  id: zod.string().uuid(),
  name: zod.string(),
  description: zod.string(),
  learningModuleURL: zod.string(),
  type: zod.union([zod.literal("prerequisite"), zod.literal("sub_material")]),
  number: zod.number(),
});

type LearningMaterial = zod.infer<typeof learningMaterialSchema>;
type LearningMaterialType = zod.infer<typeof learningMaterialSchema.shape.type>;

export { learningMaterialSchema };
export type { LearningMaterial, LearningMaterialType };
