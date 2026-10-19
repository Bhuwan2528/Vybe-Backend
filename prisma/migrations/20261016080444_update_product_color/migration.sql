/*
  Warnings:

  - Changed the column `color` on the `Product` table from a scalar field to a list field. If there are non-null values in that column, this step will fail.

*/
-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "color" SET DATA TYPE "ProductColor"[];
