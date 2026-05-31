const db = require('better-sqlite3')('local.db');
db.exec("ALTER TABLE questions ADD COLUMN type TEXT DEFAULT 'multiple_choice' NOT NULL;");
console.log("Column added successfully");
