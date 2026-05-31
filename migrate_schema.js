const fs = require('fs');
let code = fs.readFileSync('lib/db/schema.ts', 'utf8');

code = code.replace(/import \{[\s\S]*?\} from "drizzle-orm\/sqlite-core";/m, `import {
  pgTable,
  text,
  integer,
  real,
  index,
  timestamp,
  boolean,
  jsonb
} from "drizzle-orm/pg-core";`);

code = code.replace(/sqliteTable/g, 'pgTable');
code = code.replace(/integer\(([^,]+),\s*\{\s*mode:\s*"timestamp"\s*\}\)/g, 'timestamp($1)');
code = code.replace(/integer\(([^,]+),\s*\{\s*mode:\s*"boolean"\s*\}\)/g, 'boolean($1)');
code = code.replace(/text\(([^,]+),\s*\{\s*mode:\s*"json"\s*\}\)/g, 'jsonb($1)');

fs.writeFileSync('lib/db/schema.ts', code);
console.log("Schema updated");
