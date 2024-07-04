/*
  Warnings:

  - You are about to drop the column `secretAnswers` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `secretQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "secretAnswers";

-- DropTable
DROP TABLE "secretQuestions";

-- CreateTable
CREATE TABLE "SecretQuestion" (
    "id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,

    CONSTRAINT "SecretQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SecretAnswer" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "encryptedAnswer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SecretAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SecretAnswer_userId_questionId_key" ON "SecretAnswer"("userId", "questionId");

-- AddForeignKey
ALTER TABLE "SecretAnswer" ADD CONSTRAINT "SecretAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretAnswer" ADD CONSTRAINT "SecretAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SecretQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
