-- CreateTable
CREATE TABLE "Purchase" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderId" INTEGER,
    "preparationTime" INTEGER,
    "destinationAddress" TEXT NOT NULL,
    "deliveryDate" DATETIME,
    "voucher" INTEGER,
    "state" TEXT NOT NULL DEFAULT 'RECEIVED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
