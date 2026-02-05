CREATE TABLE `device_usage` (
	`deviceId` varchar(128) NOT NULL,
	`usageCount` int NOT NULL DEFAULT 0,
	`lastUsedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `device_usage_deviceId` PRIMARY KEY(`deviceId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(36) NOT NULL,
	`user_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`initial_investment` int NOT NULL,
	`yearly_revenue` int NOT NULL,
	`operating_costs` int NOT NULL,
	`maintenance_costs` int NOT NULL,
	`project_duration` int NOT NULL,
	`discount_rate` int NOT NULL,
	`revenue_growth` int NOT NULL,
	`best_case_multiplier` int NOT NULL,
	`worst_case_multiplier` int NOT NULL,
	`results` json,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scenarios` (
	`id` varchar(36) NOT NULL,
	`project_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`sales_adjustment` int NOT NULL DEFAULT 0,
	`costs_adjustment` int NOT NULL DEFAULT 0,
	`discount_adjustment` int NOT NULL DEFAULT 0,
	`is_base` int NOT NULL DEFAULT 0,
	`results` json NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `scenarios_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`subscriptionTier` enum('free','premium') NOT NULL DEFAULT 'free',
	`subscriptionExpiry` timestamp,
	`revenueCatUserId` varchar(128),
	`aiAnalysisCount` int NOT NULL DEFAULT 0,
	`aiAnalysisResetDate` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `projects` (`user_id`);--> statement-breakpoint
CREATE INDEX `created_at_idx` ON `projects` (`created_at`);--> statement-breakpoint
CREATE INDEX `project_id_idx` ON `scenarios` (`project_id`);