// inspectSchema.js
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // or replace with hardcoded string
  ssl: { rejectUnauthorized: false },
});

const query = `
  SELECT 
    table_name, 
    column_name, 
    data_type
  FROM 
    information_schema.columns
  WHERE 
    table_schema = 'public'
  ORDER BY 
    table_name, ordinal_position;
`;

async function inspectSchema() {
  try {
    const res = await pool.query(query);
    let currentTable = '';
    res.rows.forEach(({ table_name, column_name, data_type }) => {
      if (table_name !== currentTable) {
        console.log(`\n🗂️  Table: ${table_name}`);
        currentTable = table_name;
      }
      console.log(`  - ${column_name} (${data_type})`);
    });
  } catch (err) {
    console.error('Error inspecting schema:', err);
  } finally {
    await pool.end();
  }
}

inspectSchema();
