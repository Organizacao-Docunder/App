import { PrismaClient } from '@prisma/client'
import { hashText } from '../utils/bcrypt-utils';
import { hashSecretQuestions } from '../utils/hashSecretQuestions';

const prisma = new PrismaClient();

async function seed() {
  const email = process.env.CYPRESS_USER_EMAIL;
  const password = await hashText(process.env.CYPRESS_USER_PASSWORD);
  const hashedAnswer = await hashSecretQuestions([
    { questionId: 1, answer: 'aaa' },
    { questionId: 2, answer: 'aaa' },
    { questionId: 3, answer: 'aaa' },
  ]);

  await prisma.user.create({
    data: {
      email: email,
      password: password,
      name: 'Bianca',
      secretAnswers: {
        create: hashedAnswer.map((answer) => ({
          questionId: answer.questionId,
          encryptedAnswer: answer.hashedAnswer,
        })),
      },
    },
  });
}

seed().then(() => {
  console.log("🌱 Database seeded!")
}).finally(() => {
  prisma.$disconnect();
})