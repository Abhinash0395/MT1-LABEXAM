import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

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
];

const server = http.createServer((req, res) => {
  const { url, method } = req;

  // GET /
  if (url === "/" && method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>Welcome to Shopping Cart Management Web Application</h1>");
  }
  // GET /about
  else if (url === "/about" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        name: "Shopping Cart Application",
        version: "1.0.0",
        description:
          "Node.js Lab Exam demonstration using HTTP and FS modules.",
      }),
    );
  }
  // GET /cart
  else if (url === "/cart" && method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(cart));
  }
  // POST /add-to-cart
  else if (url === "/add-to-cart" && method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        const item = JSON.parse(body);
        const { id, productName, price, quantity } = item;

        if (
          !id ||
          !productName ||
          price === undefined ||
          quantity === undefined
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          return res.end(
            JSON.stringify({
              error: "id, productName, price, and quantity are required.",
            }),
          );
        }

        cart.push(item);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: item,
          }),
        );
      } catch (err) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid JSON request format." }));
      }
    });
  }
  // GET /home -> Static file serving via fs
  else if (url === "/home" && method === "GET") {
    const filePath = path.join(__dirname, "public", "index.html");
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 - Internal Server Error reading index.html");
      } else {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
      }
    });
  }
  // 404 Route handling
  else {
    res.writeHead(404, { "Content-Type": "text/html" });
    res.end("<h1>404 Not Found</h1>");
  }
});

server.listen(PORT, () => {
  console.log(`HTTP Server running at http://localhost:${PORT}`);
});
