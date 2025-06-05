const { Pool } = require("pg");
const db = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "PUT") {
    const { ProductName, ProductBarcode, Description, Price, Normal_price, Vendor } = req.body;
    const query = "UPDATE Products SET ProductName = $1, ProductBarcode = $2, Description = $3, Price = $4, Normal_price = $5, Vendor = $6 WHERE Id = $7";
    const values = [ProductName, ProductBarcode, Description, Price, Normal_price, Vendor, id];
    try { await db.query(query, values); return res.json({ message: "Product updated" }); }
    catch (err) { console.error(err); return res.status(500).json({ error: "Update failed" }); }
  }
  if (req.method === "DELETE") {
    try { await db.query("DELETE FROM Products WHERE Id = $1", [id]); return res.json({ message: "Product deleted" }); }
    catch (err) { console.error(err); return res.status(500).json({ error: "Delete failed" }); }
  }
  res.status(405).end();
}
