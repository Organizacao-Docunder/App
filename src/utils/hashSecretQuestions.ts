import { SecretQuestion } from 'src/user/interfaces/SecretQuestion';
import { hashText } from './bcrypt-utils';

export const hashSecretQuestions = async (
  questions: SecretQuestion[],
): Promise<{ questionId: number; hashedAnswer: string }[]> => {
  if (!Array.isArray(questions)) {
    throw new Error('Invalid questions array');
  }

  const hashedAnswers = await Promise.all(
    questions.map(async (question) => ({
      questionId: question.questionId,
      hashedAnswer: await hashText(question.answer.toLowerCase()),
    })),
  );
  return hashedAnswers;
};
