-- AlterTable
ALTER TABLE "Brand" ADD COLUMN "reviewAskAfterDays" INTEGER NOT NULL DEFAULT 7;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Charge" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "brandId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerChargeId" TEXT NOT NULL,
    "orderRef" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "customerEmail" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'paid',
    "paidAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "askAfterAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewEmailAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Charge_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Charge" ("amountCents", "brandId", "createdAt", "currency", "customerEmail", "customerName", "id", "orderRef", "paidAt", "provider", "providerChargeId", "status", "askAfterAt")
SELECT "amountCents", "brandId", "createdAt", "currency", "customerEmail", "customerName", "id", "orderRef", "paidAt", "provider", "providerChargeId", "status", "paidAt"
FROM "Charge";
DROP TABLE "Charge";
ALTER TABLE "new_Charge" RENAME TO "Charge";
CREATE UNIQUE INDEX "Charge_brandId_orderRef_key" ON "Charge"("brandId", "orderRef");
CREATE UNIQUE INDEX "Charge_provider_providerChargeId_key" ON "Charge"("provider", "providerChargeId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- Unused thank-you-page invites must not collect a review at checkout.
UPDATE "ReviewInvite" SET "expiresAt" = CURRENT_TIMESTAMP WHERE "usedAt" IS NULL;
