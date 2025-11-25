-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "faq_items" JSONB,
ADD COLUMN     "published_at" TIMESTAMP(3),
ADD COLUMN     "reading_minutes" INTEGER,
ADD COLUMN     "source_title" TEXT,
ADD COLUMN     "source_url" TEXT,
ADD COLUMN     "verified_at" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "article_feedback" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "user_id" TEXT,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_subscriptions" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_feedback_article_id_idx" ON "article_feedback"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_feedback_article_id_user_id_key" ON "article_feedback"("article_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "article_subscriptions_email_key" ON "article_subscriptions"("email");

-- AddForeignKey
ALTER TABLE "article_feedback" ADD CONSTRAINT "article_feedback_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_feedback" ADD CONSTRAINT "article_feedback_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
