-- CreateEnum
CREATE TYPE "SlotStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "consultation_slots" (
    "id" TEXT NOT NULL,
    "psychologist_id" TEXT NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "status" "SlotStatus" NOT NULL DEFAULT 'AVAILABLE',
    "client_name" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_slots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "consultation_slots_psychologist_id_start_time_idx" ON "consultation_slots"("psychologist_id", "start_time");

-- AddForeignKey
ALTER TABLE "consultation_slots" ADD CONSTRAINT "consultation_slots_psychologist_id_fkey" FOREIGN KEY ("psychologist_id") REFERENCES "psychologist_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
