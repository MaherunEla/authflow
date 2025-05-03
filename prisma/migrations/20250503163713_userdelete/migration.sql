-- DropForeignKey
ALTER TABLE "SuspiciousActivity" DROP CONSTRAINT "SuspiciousActivity_userId_fkey";

-- AddForeignKey
ALTER TABLE "SuspiciousActivity" ADD CONSTRAINT "SuspiciousActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
