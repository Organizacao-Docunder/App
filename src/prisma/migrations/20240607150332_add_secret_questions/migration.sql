/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `SecretAnswer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SecretAnswer" DROP COLUMN "updatedAt";

INSERT INTO "SecretQuestion" (question) VALUES
('Qual seu animal favorito?'),
('Em qual cidade você nasceu?'),
('Qual sua cor favorita?'),
('Qual seu número da sorte?'),
('Qual foi seu primeiro emprego?'),
('Qual foi a sua fruta favorita?'),
('Qual foi o seu esporte favorito?'),
('Qual foi o seu time favorito?'),
('Qual foi a sua comida favorita?');
