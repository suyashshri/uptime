-- CreateEnum
CREATE TYPE "public"."WebsiteStatus" AS ENUM ('Up', 'Down', 'Pending');

-- CreateTable
CREATE TABLE "public"."Region" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."WebsiteTicks" (
    "id" TEXT NOT NULL,
    "responseTimeMs" INTEGER NOT NULL,
    "status" "public"."WebsiteStatus" NOT NULL,
    "regionId" TEXT NOT NULL,
    "websiteId" TEXT NOT NULL,

    CONSTRAINT "WebsiteTicks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."WebsiteTicks" ADD CONSTRAINT "WebsiteTicks_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "public"."Region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WebsiteTicks" ADD CONSTRAINT "WebsiteTicks_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "public"."Website"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
