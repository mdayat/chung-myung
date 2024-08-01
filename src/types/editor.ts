import type { Blob } from "node:buffer";
import { z as zod } from "zod";

interface TaggedBlob {
  imageTag: string;
  blob: Blob;
}

// This schema is mirroring a third party library, quill-delta.
// Make sure this schema is up-to-date to the third party library.
const deltaOperationSchema = zod.object({
  insert: zod
    .union([zod.string(), zod.record(zod.string(), zod.unknown())])
    .optional(),
  delete: zod.number().optional(),
  retain: zod
    .union([zod.number(), zod.record(zod.string(), zod.unknown())])
    .optional(),
  attributes: zod.record(zod.string(), zod.unknown()).optional(),
});
type DeltaOperation = zod.infer<typeof deltaOperationSchema>;

const questionEditorSchema = zod.object({
  type: zod.literal("question"),
  deltaOperations: zod.array(deltaOperationSchema),
});
type QuestionEditor = zod.infer<typeof questionEditorSchema>;

const explanationEditorSchema = zod.object({
  type: zod.literal("explanation"),
  deltaOperations: zod.array(deltaOperationSchema),
});
type ExplanationEditor = zod.infer<typeof explanationEditorSchema>;

const taggedDeltaSchema = zod.object({
  tag: zod.string(),
  deltaOperations: zod.array(deltaOperationSchema),
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
type Editor = zod.infer<typeof editorSchema>;

export { editorSchema };
export type {
  DeltaOperation,
  Editor,
  ExplanationEditor,
  MultipleChoiceEditor,
  QuestionEditor,
  TaggedBlob,
  TaggedDelta,
};
