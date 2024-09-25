-- CreateTable
CREATE TABLE "Tokens" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "jwt_token" TEXT NOT NULL,

    CONSTRAINT "Tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tokens_ip_key" ON "Tokens"("ip");
