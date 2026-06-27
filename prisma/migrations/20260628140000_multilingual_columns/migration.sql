-- Multilingual columns on products/categories; drop translation tables.

-- Categories: add localized columns
ALTER TABLE "categories" ADD COLUMN "slug" TEXT;
ALTER TABLE "categories" ADD COLUMN "nameHy" TEXT;
ALTER TABLE "categories" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "categories" ADD COLUMN "nameRu" TEXT;
ALTER TABLE "categories" ADD COLUMN "descriptionHy" TEXT;
ALTER TABLE "categories" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "categories" ADD COLUMN "descriptionRu" TEXT;

UPDATE "categories" c SET
  "slug" = CASE c."name"
    WHEN 'Пиде' THEN 'pide'
    WHEN 'Комбо' THEN 'combo'
    WHEN 'Снэк' THEN 'snack'
    WHEN 'Соусы' THEN 'sauces'
    WHEN 'Напитки' THEN 'drinks'
    ELSE lower(replace(c."name", ' ', '-'))
  END,
  "nameRu" = c."name",
  "descriptionRu" = c."description",
  "nameHy" = COALESCE(
    (SELECT ct."name" FROM "category_translations" ct WHERE ct."categoryId" = c."id" AND ct."locale" = 'hy'),
    c."name"
  ),
  "nameEn" = COALESCE(
    (SELECT ct."name" FROM "category_translations" ct WHERE ct."categoryId" = c."id" AND ct."locale" = 'en'),
    c."name"
  ),
  "descriptionHy" = (SELECT ct."description" FROM "category_translations" ct WHERE ct."categoryId" = c."id" AND ct."locale" = 'hy'),
  "descriptionEn" = (SELECT ct."description" FROM "category_translations" ct WHERE ct."categoryId" = c."id" AND ct."locale" = 'en');

ALTER TABLE "categories" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "nameHy" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "nameEn" SET NOT NULL;
ALTER TABLE "categories" ALTER COLUMN "nameRu" SET NOT NULL;

CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_name_key";
ALTER TABLE "categories" DROP COLUMN "name";
ALTER TABLE "categories" DROP COLUMN "description";

-- Products: add localized columns
ALTER TABLE "products" ADD COLUMN "slug" TEXT;
ALTER TABLE "products" ADD COLUMN "nameHy" TEXT;
ALTER TABLE "products" ADD COLUMN "nameEn" TEXT;
ALTER TABLE "products" ADD COLUMN "nameRu" TEXT;
ALTER TABLE "products" ADD COLUMN "descriptionHy" TEXT;
ALTER TABLE "products" ADD COLUMN "descriptionEn" TEXT;
ALTER TABLE "products" ADD COLUMN "descriptionRu" TEXT;
ALTER TABLE "products" ADD COLUMN "ingredientsHy" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "products" ADD COLUMN "ingredientsEn" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "products" ADD COLUMN "ingredientsRu" TEXT[] DEFAULT ARRAY[]::TEXT[];

UPDATE "products" p SET
  "slug" = p."id",
  "nameRu" = p."name",
  "descriptionRu" = p."description",
  "ingredientsRu" = p."ingredients",
  "nameHy" = COALESCE(
    (SELECT pt."name" FROM "product_translations" pt WHERE pt."productId" = p."id" AND pt."locale" = 'hy'),
    p."name"
  ),
  "nameEn" = COALESCE(
    (SELECT pt."name" FROM "product_translations" pt WHERE pt."productId" = p."id" AND pt."locale" = 'en'),
    p."name"
  ),
  "descriptionHy" = COALESCE(
    (SELECT pt."description" FROM "product_translations" pt WHERE pt."productId" = p."id" AND pt."locale" = 'hy'),
    p."description"
  ),
  "descriptionEn" = COALESCE(
    (SELECT pt."description" FROM "product_translations" pt WHERE pt."productId" = p."id" AND pt."locale" = 'en'),
    p."description"
  ),
  "ingredientsHy" = COALESCE(
    (SELECT pt."ingredients" FROM "product_translations" pt WHERE pt."productId" = p."id" AND pt."locale" = 'hy'),
    p."ingredients"
  ),
  "ingredientsEn" = COALESCE(
    (SELECT pt."ingredients" FROM "product_translations" pt WHERE pt."productId" = p."id" AND pt."locale" = 'en'),
    p."ingredients"
  );

ALTER TABLE "products" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "nameHy" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "nameEn" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "nameRu" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "descriptionHy" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "descriptionEn" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "descriptionRu" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "ingredientsHy" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "ingredientsEn" SET NOT NULL;
ALTER TABLE "products" ALTER COLUMN "ingredientsRu" SET NOT NULL;

CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_name_key";
ALTER TABLE "products" DROP COLUMN "name";
ALTER TABLE "products" DROP COLUMN "description";
ALTER TABLE "products" DROP COLUMN "ingredients";

-- Drop translation tables and locale enum
DROP TABLE "product_translations";
DROP TABLE "category_translations";
DROP TYPE "ContentLocale";
