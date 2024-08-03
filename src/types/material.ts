import { z as zod } from "zod";

const materialSchema = zod.object({
  id: zod.string().uuid(),
  name: zod.string(),
  description: zod.string(),
  number: zod.number(),
});
type Material = zod.infer<typeof materialSchema>;

export { materialSchema };
export type { Material };
