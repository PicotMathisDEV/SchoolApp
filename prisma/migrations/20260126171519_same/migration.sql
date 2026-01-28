/*
  Warnings:

  - You are about to drop the column `images` on the `Classe` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Classe` table. All the data in the column will be lost.
  - You are about to drop the column `userNumber` on the `Classe` table. All the data in the column will be lost.
  - Added the required column `teacherId` to the `Classe` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Classe" DROP CONSTRAINT "Classe_userId_fkey";

-- DropIndex
DROP INDEX "Classe_userId_idx";

-- AlterTable
ALTER TABLE "Classe" DROP COLUMN "images",
DROP COLUMN "userId",
DROP COLUMN "userNumber",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "teacherId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_StudentClasses" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_StudentClasses_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StudentClasses_B_index" ON "_StudentClasses"("B");

-- CreateIndex
CREATE INDEX "Classe_teacherId_idx" ON "Classe"("teacherId");

-- AddForeignKey
ALTER TABLE "Classe" ADD CONSTRAINT "Classe_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentClasses" ADD CONSTRAINT "_StudentClasses_A_fkey" FOREIGN KEY ("A") REFERENCES "Classe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentClasses" ADD CONSTRAINT "_StudentClasses_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
