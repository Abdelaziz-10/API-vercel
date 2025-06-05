const { Pool } = require("pg");
const db = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { ProductName, ProductBarcode, Description, Price, Normal_price, Vendor } = req.body;
  try {
    const query = "INSERT INTO Products (ProductName, ProductBarcode, Description, Price, Normal_price, Vendor) VALUES ($1, $2, $3, $4, $5, $6) RETURNING Id";
    const values = [ProductName, ProductBarcode, Description, Price, Normal_price, Vendor];
    const { rows } = await db.query(query, values);
    res.status(201).json({ id: rows[0].id, message: "Product added" });
  } catch (err) {
    console.error(err); res.status(500).json({ error: "Insert failed" });
  }
}
