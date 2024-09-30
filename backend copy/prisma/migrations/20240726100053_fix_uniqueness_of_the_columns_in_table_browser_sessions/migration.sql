/*
  Warnings:

  - A unique constraint covering the columns `[browser_token]` on the table `BrowserSessions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `BrowserSessions_browser_token_key` ON `BrowserSessions`(`browser_token`);
