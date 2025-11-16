z/*
  Warnings:

  - A unique constraint covering the columns `[mobileNumber]` on the table `SignUp` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SignUp_mobileNumber_key" ON "SignUp"("mobileNumber");
z