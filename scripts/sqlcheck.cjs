// Dev-only Postgres syntax checker for migrations (run via: node scripts/sqlcheck.cjs <files...>).
// Uses pg-query-emscripten (installed with `npm i --no-save pg-query-emscripten`).
// Catches parse/syntax errors before deploy; does NOT validate semantics (table/column existence).
const PgQueryFactory = require("pg-query-emscripten").default;
const { readFileSync } = require("fs");

(async () => {
  const files = process.argv.slice(2);
  const pg = await PgQueryFactory();
  let bad = 0;
  for (const f of files) {
    const sql = readFileSync(f, "utf8");
    const res = pg.parse(sql);
    if (res.error) {
      bad++;
      console.log(`FAIL ${f}`);
      console.log(`   ${res.error.message} (line ${res.error.lineNumber ?? "?"}, cursor ${res.error.cursorpos ?? "?"})`);
    } else {
      const n = (res.parse_tree && res.parse_tree.stmts ? res.parse_tree.stmts.length : 0);
      console.log(`OK   ${f}  (${n} statements)`);
    }
  }
  process.exit(bad ? 1 : 0);
})();
