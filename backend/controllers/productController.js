import { sql } from "../config/db.js";

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
            SELECT * FROM products
            ORDER BY created_at DESC
        `;
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error when fetching products", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price || !image) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const newProduct = await sql`  
            INSERT INTO products (name,price,image)
            VALUES (${name}, ${price}, ${image})
            RETURNING * 
        `;
    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error when creating products", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getProduct = async (req, res) => {
  const { id } = req.params;

  try {
    // get only the product that matches the id
    const product = await sql`
            SELECT * FROM products WHERE id = ${id} 
        `;
    res.status(200).json({ success: true, data: product[0] });
  } catch (error) {
    console.log("Error when fetching a product", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const updateProduct = async (req, res) => {
  // update the specified product by id
  const { id } = req.params;
  const { name, price, image } = req.body;

  try {
    const updateProduct = await sql`
            UPDATE products
            SET name=${name}, price=${price}, image=${image}
            WHERE id = ${id}
            RETURNING *
        `;
    if (updateProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product Not Found" });
    }
    res.status(200).json({ success: true, data: updateProduct[0] });
  } catch (error) {
    console.log("Error when updating the product", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
        DELETE FROM products WHERE id= ${id} RETURNING *
    `;
    // check if the product exist
    if (deletedProduct.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: " Product NOT Found" });
    }
    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.log("Error when deleting a product", error);
    res.status(500).json({ success: true, message: "Internal Server Error" });
  }
};
