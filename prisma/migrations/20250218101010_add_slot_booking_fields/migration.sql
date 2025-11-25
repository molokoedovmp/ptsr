-- Add client contact fields to consultation slots
ALTER TABLE "consultation_slots"
ADD COLUMN "client_email" TEXT,
ADD COLUMN "client_phone" TEXT,
ADD COLUMN "client_message" TEXT,
ADD COLUMN "booked_by_user_id" TEXT;

-- Track which user booked the slot (if authenticated)
ALTER TABLE "consultation_slots"
ADD CONSTRAINT "consultation_slots_booked_by_user_id_fkey"
FOREIGN KEY ("booked_by_user_id") REFERENCES "users"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "consultation_slots_booked_by_user_id_idx"
ON "consultation_slots"("booked_by_user_id");
