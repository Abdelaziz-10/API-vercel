const { Pool } = require("pg");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export default async function handler(req, res) {
  try {
    const { ProductBarcode } = req.query;
    let query = "SELECT * FROM Products_ar";
    const values = [];

    if (ProductBarcode) {
      query += " WHERE ProductBarcode = $1";
      values.push(ProductBarcode);
    }

    const { rows: products } = await db.query(query, values);
    const ids = products.map(p => p.id);
    if (ids.length === 0) return res.status(200).json([]);

    const { rows: images } = await db.query(
      "SELECT * FROM ProductImages_ar WHERE ProductId = ANY($1)", [ids]
    );

    for (let product of products) {
      product.Images = images
        .filter(img => img.productid === product.id)
        .map(i => i.imageurl);
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}
