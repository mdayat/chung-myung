export interface AKBSample {
  id: string;
  name: string;
  description: string;
  type: string;
  learning_module_url: string;
  sequence_number: number;
  questions: question[];
}

export interface question {
  id: string;
  content: string;
  explanation: string;
  indicator_name: string;
  id_jawaban_user: string;
  url_gambar?: string | null | undefined;
  multiple_choices: multipleChoice[];
}

export interface multipleChoice {
  id: string;
  url_gambar?: string | null | undefined;
  content?: string | null | undefined;
  is_correct_answer: boolean;
}
