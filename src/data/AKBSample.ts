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
  multiple_choices: multipleChoice[];
}

export interface multipleChoice {
  id: string;
  content: string;
  is_correct_answer: boolean;
}
