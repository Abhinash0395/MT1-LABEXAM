import express from "express";

const app = express();
const PORT = 4000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Initial array containing at least three sample shopping cart items
let cart = [
  {
    id: 1,
    productName: "Wireless Mouse",
    price: 799,
    quantity: 2,
    category: "Electronics",
  },
  {
    id: 2,
    productName: "Mechanical Keyboard",
    price: 2499,
    quantity: 1,
    category: "Electronics",
  },
  {
    id: 3,
    productName: "USB-C Cable",
    price: 299,
    quantity: 3,
    category: "Accessories",
  },
];

// Helper function to calculate total price (price * quantity)
const formatCartItem = (item) => ({
  ...item,
  totalPrice: item.price * item.quantity,
});

// GET /cart - Retrieve all cart items
app.get("/cart", (req, res) => {
  const formattedCart = cart.map(formatCartItem);
  res.status(200).json(formattedCart);
});

// GET /cart/:id - Retrieve a cart item by ID
app.get("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const item = cart.find((p) => p.id === itemId);

  if (!item) {
    return res
      .status(404)
      .json({ error: `Product with ID ${itemId} not found` });
  }

  res.status(200).json(formatCartItem(item));
});

// POST /cart - Add a new product to the cart
app.post("/cart", (req, res) => {
  const { id, productName, price, quantity, category } = req.body;

  // Validation for required fields
  if (
    !id ||
    !productName ||
    price === undefined ||
    quantity === undefined ||
    !category
  ) {
    return res.status(400).json({
      error:
        "id, productName, price, quantity, and category are required fields.",
    });
  }

  const existing = cart.find((p) => p.id === Number(id));
  if (existing) {
    return res
      .status(400)
      .json({ error: `Product with ID ${id} already exists.` });
  }

  const newProduct = {
    id: Number(id),
    productName,
    price: Number(price),
    quantity: Number(quantity),
    category,
  };

  cart.push(newProduct);

  res.status(201).json({
    message: "Product added successfully",
    product: formatCartItem(newProduct),
  });
});

// PUT /cart/:id - Update product details
app.put("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const itemIndex = cart.findIndex((p) => p.id === itemId);

  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ error: `Product with ID ${itemId} not found` });
  }

  const { productName, price, quantity, category } = req.body;

  cart[itemIndex] = {
    ...cart[itemIndex],
    productName:
      productName !== undefined ? productName : cart[itemIndex].productName,
    price: price !== undefined ? Number(price) : cart[itemIndex].price,
    quantity:
      quantity !== undefined ? Number(quantity) : cart[itemIndex].quantity,
    category: category !== undefined ? category : cart[itemIndex].category,
  };

  res.status(200).json({
    message: "Product updated successfully",
    product: formatCartItem(cart[itemIndex]),
  });
});

// DELETE /cart/:id - Remove a product from the cart
app.delete("/cart/:id", (req, res) => {
  const itemId = parseInt(req.params.id, 10);
  const itemIndex = cart.findIndex((p) => p.id === itemId);

  if (itemIndex === -1) {
    return res
      .status(404)
      .json({ error: `Product with ID ${itemId} not found` });
  }

  const removedProduct = cart.splice(itemIndex, 1)[0];

  res.status(200).json({
    message: `Product with ID ${itemId} deleted successfully`,
    product: formatCartItem(removedProduct),
  });
});

// 404 Route handling for invalid endpoints
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found on Express API server" });
});

// Start listening on port 4000
app.listen(PORT, () => {
  console.log(`Express Server running at http://localhost:${PORT}`);
});
