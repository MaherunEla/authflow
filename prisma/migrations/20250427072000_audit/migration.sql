-- CreateEnum
CREATE TYPE "ActionTargetType" AS ENUM ('FAILED_LOGIN', 'SUSPICIOUS_ACTIVITY', 'USER_MANAGEMENT');

-- CreateEnum
CREATE TYPE "AdminActionType" AS ENUM ('LOCK_ACCOUNT', 'UNLOCK_ACCOUNT', 'FORCE_LOGOUT', 'SEND_ALERT', 'WARN_USER', 'SUSPEND_USER', 'UPDATE_USER_STATUS');

-- CreateTable
CREATE TABLE "AdminActionLog" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "actionTargetType" "ActionTargetType" NOT NULL,
    "targetId" TEXT NOT NULL,
    "actionType" "AdminActionType" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminActionLog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AdminActionLog" ADD CONSTRAINT "AdminActionLog_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
