-- CreateTable
CREATE TABLE "anxiety_test_results" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "test_slug" TEXT NOT NULL,
    "test_title" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "max_score" INTEGER NOT NULL,
    "severity" TEXT NOT NULL,
    "answers" JSONB,
    "completed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "anxiety_test_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "anxiety_test_results_user_id_completed_at_idx" ON "anxiety_test_results"("user_id", "completed_at");

-- AddForeignKey
ALTER TABLE "anxiety_test_results" ADD CONSTRAINT "anxiety_test_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
