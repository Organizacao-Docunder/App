/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `SecretAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SecretAnswer" DROP COLUMN "updatedAt";

INSERT INTO "SecretQuestion" (question) VALUES
('What is your mother''s maiden name?'),
('What was the name of your first pet?'),
('What was the name of your elementary school?');
