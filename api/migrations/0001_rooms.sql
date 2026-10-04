CREATE TABLE `rooms` (
	`code` text PRIMARY KEY NOT NULL,
	`host_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`host_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rooms_host_id_unique` ON `rooms` (`host_id`);