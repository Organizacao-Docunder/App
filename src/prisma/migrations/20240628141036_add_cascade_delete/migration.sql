-- DropForeignKey
ALTER TABLE "SecretAnswer" DROP CONSTRAINT "SecretAnswer_questionId_fkey";

-- DropForeignKey
ALTER TABLE "SecretAnswer" DROP CONSTRAINT "SecretAnswer_userId_fkey";

-- AddForeignKey
ALTER TABLE "SecretAnswer" ADD CONSTRAINT "SecretAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SecretAnswer" ADD CONSTRAINT "SecretAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "SecretQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
