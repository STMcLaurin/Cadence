CREATE TABLE `profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`wake_time` text DEFAULT '07:00' NOT NULL,
	`sleep_time` text DEFAULT '22:30' NOT NULL,
	`work_days` text DEFAULT 'Mon,Tue,Wed,Thu,Fri' NOT NULL,
	`setup_complete` integer DEFAULT false NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `records` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`data` text DEFAULT '{}' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_records_user_type` ON `records` (`user_id`,`type`);--> statement-breakpoint
CREATE INDEX `idx_records_user_order` ON `records` (`user_id`,`sort_order`);