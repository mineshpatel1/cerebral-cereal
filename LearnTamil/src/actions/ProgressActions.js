import { INIT_PROGRESS, ANSWER_QUESTION, CLEAR_PROGRESS } from './types';

export const initProgress = progress => ({
  type: INIT_PROGRESS,
  progress,
});

export const clearProgress = () => ({
  type: CLEAR_PROGRESS,
});

export const answerQuestion = (isCorrect, categoryId) => ({
  type: ANSWER_QUESTION,
  isCorrect,
  categoryId,
});
