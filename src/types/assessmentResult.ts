import { z as zod } from "zod";

const assessmentResultSchema = zod.object({
  id: zod.string().uuid(),
  type: zod.union([
    zod.literal("asesmen_kesiapan_belajar"),
    zod.literal("asesmen_akhir"),
  ]),
  attempt: zod.number().lte(3),
  createdAt: zod.string(),
});
type AssessmentResult = zod.infer<typeof assessmentResultSchema>;

export { assessmentResultSchema };
export type { AssessmentResult };
