-- AlterTable
ALTER TABLE "article_feedback" ADD COLUMN     "comment" TEXT;

-- CreateTable
CREATE TABLE "article_bookmarks" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_bookmarks_user_id_created_at_idx" ON "article_bookmarks"("user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "article_bookmarks_article_id_user_id_key" ON "article_bookmarks"("article_id", "user_id");

-- AddForeignKey
ALTER TABLE "article_bookmarks" ADD CONSTRAINT "article_bookmarks_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_bookmarks" ADD CONSTRAINT "article_bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
