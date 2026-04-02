/*
  Warnings:

  - A unique constraint covering the columns `[productVariantId]` on the table `Inventory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Inventory_productVariantId_key" ON "Inventory"("productVariantId");
