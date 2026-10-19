/*
  Warnings:

  - You are about to drop the column `category` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `style` on the `Product` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `Decimal(10,2)`.
  - Added the required column `subCategoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `color` on the `Product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `imageUrl` on table `Product` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProductColor" AS ENUM ('BLACK', 'WHITE', 'OFF_WHITE', 'CREAM', 'BEIGE', 'GREY', 'CHARCOAL', 'BROWN', 'TAN', 'NAVY_BLUE', 'ROYAL_BLUE', 'SKY_BLUE', 'DENIM_BLUE', 'OLIVE_GREEN', 'SAGE_GREEN', 'FOREST_GREEN', 'MINT', 'BURGUNDY', 'MAROON', 'RED', 'MUSTARD', 'RUST', 'PINK', 'LAVENDER', 'MULTICOLOR', 'OTHER');

-- CreateEnum
CREATE TYPE "ProductFit" AS ENUM ('REGULAR', 'RELAXED', 'OVERSIZED', 'BOXY', 'STRAIGHT', 'TAPERED', 'WIDE_LEG');

-- CreateEnum
CREATE TYPE "ProductStyle" AS ENUM ('STREETWEAR', 'MINIMAL', 'CASUAL', 'SMART_CASUAL', 'CLASSIC');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "category",
DROP COLUMN "style",
ADD COLUMN     "fit" "ProductFit",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "styleTags" "ProductStyle"[] DEFAULT ARRAY[]::"ProductStyle"[],
ADD COLUMN     "subCategoryId" INTEGER NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2),
DROP COLUMN "color",
ADD COLUMN     "color" "ProductColor" NOT NULL,
ALTER COLUMN "imageUrl" SET NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "SubCategory_categoryId_idx" ON "SubCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_categoryId_name_key" ON "SubCategory"("categoryId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "SubCategory_categoryId_slug_key" ON "SubCategory"("categoryId", "slug");

-- CreateIndex
CREATE INDEX "Product_subCategoryId_isActive_idx" ON "Product"("subCategoryId", "isActive");

-- CreateIndex
CREATE INDEX "Product_color_idx" ON "Product"("color");

-- CreateIndex
CREATE INDEX "Product_price_idx" ON "Product"("price");

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
