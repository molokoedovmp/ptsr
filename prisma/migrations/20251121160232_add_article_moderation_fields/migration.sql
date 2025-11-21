-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "moderation_comment" TEXT,
ADD COLUMN     "status" "ArticleStatus" NOT NULL DEFAULT 'APPROVED';
