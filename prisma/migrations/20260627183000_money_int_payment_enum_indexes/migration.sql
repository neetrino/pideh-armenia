-- Money as integer (AMD), payment enum, indexes, unique product names

CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'ARCA', 'IDRAM', 'AMERIABANK');

ALTER TABLE "products" ADD COLUMN "price_int" INTEGER;
UPDATE "products" SET "price_int" = ROUND("price")::INTEGER;
ALTER TABLE "products" DROP COLUMN "price";
ALTER TABLE "products" RENAME COLUMN "price_int" TO "price";
ALTER TABLE "products" ALTER COLUMN "price" SET NOT NULL;

ALTER TABLE "orders" ADD COLUMN "total_int" INTEGER;
UPDATE "orders" SET "total_int" = ROUND("total")::INTEGER;
ALTER TABLE "orders" DROP COLUMN "total";
ALTER TABLE "orders" RENAME COLUMN "total_int" TO "total";
ALTER TABLE "orders" ALTER COLUMN "total" SET NOT NULL;

ALTER TABLE "order_items" ADD COLUMN "price_int" INTEGER;
UPDATE "order_items" SET "price_int" = ROUND("price")::INTEGER;
ALTER TABLE "order_items" DROP COLUMN "price";
ALTER TABLE "order_items" RENAME COLUMN "price_int" TO "price";
ALTER TABLE "order_items" ALTER COLUMN "price" SET NOT NULL;

ALTER TABLE "orders" ADD COLUMN "payment_method_new" "public"."PaymentMethod";
UPDATE "orders" SET "payment_method_new" = CASE
  WHEN LOWER("paymentMethod") IN ('cash', 'наличные', 'наличными') THEN 'CASH'::"public"."PaymentMethod"
  WHEN LOWER("paymentMethod") IN ('card', 'arca', 'картой') THEN 'ARCA'::"public"."PaymentMethod"
  WHEN LOWER("paymentMethod") IN ('idram') THEN 'IDRAM'::"public"."PaymentMethod"
  WHEN LOWER("paymentMethod") IN ('ameriabank', 'ameria') THEN 'AMERIABANK'::"public"."PaymentMethod"
  ELSE 'CASH'::"public"."PaymentMethod"
END;
ALTER TABLE "orders" DROP COLUMN "paymentMethod";
ALTER TABLE "orders" RENAME COLUMN "payment_method_new" TO "paymentMethod";
ALTER TABLE "orders" ALTER COLUMN "paymentMethod" SET NOT NULL;

CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

CREATE INDEX "products_categoryId_idx" ON "products"("categoryId");
CREATE INDEX "products_status_idx" ON "products"("status");
CREATE INDEX "products_isAvailable_idx" ON "products"("isAvailable");

CREATE INDEX "orders_userId_idx" ON "orders"("userId");
CREATE INDEX "orders_status_idx" ON "orders"("status");
CREATE INDEX "orders_createdAt_idx" ON "orders"("createdAt");

CREATE INDEX "order_items_orderId_idx" ON "order_items"("orderId");
CREATE INDEX "order_items_productId_idx" ON "order_items"("productId");
