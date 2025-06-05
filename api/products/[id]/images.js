const { Pool } = require("pg");
const db = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method === "GET") {
    try {
      const { rows } = await db.query("SELECT ImageUrl FROM ProductImages WHERE ProductId = $1", [id]);
      return res.json(rows.map(r => r.imageurl));
    } catch (err) {
      console.error(err); return res.status(500).json({ error: "Fetch failed" });
    }
  }
  if (req.method === "POST") {
    const { ImageUrl } = req.body;
    try {
      const result = await db.query("INSERT INTO ProductImages (ProductId, ImageUrl) VALUES ($1, $2) RETURNING Id", [id, ImageUrl]);
      return res.status(201).json({ id: result.rows[0].id, message: "Image added" });
    } catch (err) {
      console.error(err); return res.status(500).json({ error: "Insert image failed" });
    }
  }
  res.status(405).end();
}
