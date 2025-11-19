-- AlterEnum
ALTER TYPE "ApplicationStatus" ADD VALUE 'ACTIVATED';

-- AlterTable
ALTER TABLE "psychologist_applications" ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "activated_at" TIMESTAMP(3),
ADD COLUMN     "activation_token" TEXT,
ADD COLUMN     "activation_token_expires" TIMESTAMP(3);
