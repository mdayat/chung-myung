import { z as zod } from "zod";

const multipleChoiceSchema = zod.object({
  id: zod.string().uuid(),
  content: zod.string(),
  isCorrect: zod.boolean(),
});

const questionSchema = zod.object({
  id: zod.string().uuid(),
  content: zod.string(),
  explanation: zod.string(),
  taxonomyBloom: zod.union([
    zod.literal("c1"),
    zod.literal("c2"),
    zod.literal("c3"),
    zod.literal("c4"),
    zod.literal("c5"),
    zod.literal("c6"),
  ]),
  multipleChoice: zod.array(multipleChoiceSchema),
});

type Question = zod.infer<typeof questionSchema>;
type MultipleChoice = zod.infer<typeof multipleChoiceSchema>;
type TaxonomyBloom = zod.infer<typeof questionSchema.shape.taxonomyBloom>;

export { questionSchema };
export type { MultipleChoice, Question, TaxonomyBloom };
