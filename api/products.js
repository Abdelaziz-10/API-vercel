const { Pool } = require("pg");
const db = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
export default async function handler(req, res) {
  try {
    const { ProductBarcode } = req.query;
    let query = "SELECT * FROM Products";
    const params = [];
    if (ProductBarcode) {
      query += " WHERE ProductBarcode = $1";
      params.push(ProductBarcode);
    }
    const { rows: products } = await db.query(query, params);
    if (products.length === 0) return res.status(200).json([]);
    const ids = products.map(p => p.id);
    const { rows: images } = await db.query(
      "SELECT ProductId, ImageUrl FROM ProductImages WHERE ProductId = ANY($1)", [ids]
    );
    for (let product of products) {
      product.Images = images.filter(img => img.productid === product.id).map(i => i.imageurl);
    }
    res.status(200).json(products);
  } catch (err) {
    console.error(err); res.status(500).json({ error: "Server error" });
  }
}
