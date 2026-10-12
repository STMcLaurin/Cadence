import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const profiles = sqliteTable("profiles", {
  userId: text("user_id").primaryKey(), name: text("name").notNull(), wakeTime: text("wake_time").notNull().default("07:00"),
  sleepTime: text("sleep_time").notNull().default("22:30"), workDays: text("work_days").notNull().default("Mon,Tue,Wed,Thu,Fri"),
  setupComplete: integer("setup_complete", { mode: "boolean" }).notNull().default(false), updatedAt: text("updated_at").notNull(),
});
export const records = sqliteTable("records", {
  id: text("id").primaryKey(), userId: text("user_id").notNull(), type: text("type").notNull(), title: text("title").notNull(), data: text("data").notNull().default("{}"),
  sortOrder: integer("sort_order").notNull().default(0), completed: integer("completed", { mode: "boolean" }).notNull().default(false), createdAt: text("created_at").notNull(), updatedAt: text("updated_at").notNull(),
}, (table) => [index("idx_records_user_type").on(table.userId, table.type), index("idx_records_user_order").on(table.userId, table.sortOrder)]);
