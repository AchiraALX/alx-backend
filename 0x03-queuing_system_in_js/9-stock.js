import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

const app = express();
const port = 1245;

const listProducts = [
  { itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4 },
  { itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10 },
  { itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2 },
  { itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5 }
];

const redisClient = redis.createClient();
const hgetallAsync = promisify(redisClient.hgetall).bind(redisClient);

// Function to get item by ID
const getItemById = (id) => {
  return listProducts.find((item) => item.itemId === id);
};

// Function to reserve stock by ID
const reserveStockById = (itemId, stock) => {
  redisClient.hset(`item.${itemId}`, 'stock', stock, (err, reply) => {
    if (err) {
      console.error('Error reserving stock:', err);
    }
  });
};

// Async function to get current reserved stock by ID
const getCurrentReservedStockById = async (itemId) => {
  const result = await hgetallAsync(`item.${itemId}`);
  return result ? parseInt(result.stock) : 0;
};

// Route to get list of products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route to get product details by ID
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (item) {
    const currentQuantity = await getCurrentReservedStockById(itemId);
    res.json({ ...item, currentQuantity });
  } else {
    res.json({ status: 'Product not found' });
  }
});

// Route to reserve a product by ID
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const item = getItemById(itemId);

  if (!item) {
    res.json({ status: 'Product not found' });
  } else {
    const currentQuantity = await getCurrentReservedStockById(itemId);

    if (currentQuantity <= 0) {
      res.json({ status: 'Not enough stock available', itemId });
    } else {
      reserveStockById(itemId, currentQuantity - 1);
      res.json({ status: 'Reservation confirmed', itemId });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export { reserveStockById, getCurrentReservedStockById };
