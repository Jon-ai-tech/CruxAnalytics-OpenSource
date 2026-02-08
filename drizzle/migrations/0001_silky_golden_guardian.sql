ALTER TABLE `projects` ADD `vanguard_input` json;--> statement-breakpoint
ALTER TABLE `projects` ADD `saas_input` json;--> statement-breakpoint
ALTER TABLE `projects` ADD `risk_input` json;--> statement-breakpoint
ALTER TABLE `projects` ADD `business_model` varchar(50) DEFAULT 'standard';