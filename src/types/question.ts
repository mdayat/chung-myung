import type { Blob } from "node:buffer";
import { z as zod } from "zod";

type LearningMaterialType = "prerequisites" | "sub-materials";
interface TaggedBlob {
  imageTag: string;
  blob: Blob;
}

// This schema is mirroring a third party library, quill-delta.
// Make sure this schema is up-to-date to the third party library.
const deltaOpsSchema = zod.array(
  zod.object({
    insert: zod
      .union([zod.string(), zod.record(zod.string(), zod.unknown())])
      .optional(),
    delete: zod.number().optional(),
    retain: zod
      .union([zod.number(), zod.record(zod.string(), zod.unknown())])
      .optional(),
    attributes: zod.map(zod.string(), zod.unknown()).optional(),
  }),
);
type DeltaOps = zod.infer<typeof deltaOpsSchema>;

const questionEditorSchema = zod.object({
  type: zod.literal("question"),
  deltaOps: deltaOpsSchema,
});
type QuestionEditor = zod.infer<typeof questionEditorSchema>;

const explanationEditorSchema = zod.object({
  type: zod.literal("explanation"),
  deltaOps: deltaOpsSchema,
});
type ExplanationEditor = zod.infer<typeof explanationEditorSchema>;

const taggedDeltaSchema = zod.object({
  tag: zod.string(),
  deltaOps: deltaOpsSchema,
});
type TaggedDelta = zod.infer<typeof taggedDeltaSchema>;

const multipleChoiceEditorSchema = zod.object({
  type: zod.literal("multipleChoice"),
  taggedDeltas: zod.array(taggedDeltaSchema),
});
type MultipleChoiceEditor = zod.infer<typeof multipleChoiceEditorSchema>;

const editorSchema = zod.discriminatedUnion("type", [
  questionEditorSchema,
  explanationEditorSchema,
  multipleChoiceEditorSchema,
]);

export { editorSchema };
export type {
  DeltaOps,
  ExplanationEditor,
  LearningMaterialType,
  MultipleChoiceEditor,
  QuestionEditor,
  TaggedBlob,
  TaggedDelta,
};
