/*
  Warnings:

  - Added the required column `muted` to the `Project_member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project_member" ADD COLUMN     "muted" BOOLEAN NOT NULL;
