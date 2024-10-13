import express from 'express';
const app = express();
const port = 3000;
import fs from "fs"

// Middleware to parse JSON bodies
app.use(express.json());

// to read data
const readData = () => {
  const data = fs.readFileSync('./data.json');
  return JSON.parse(data);
};

// to rewrite updated data
const writeData = (data) => {
  fs.writeFileSync('./data.json', JSON.stringify(data, null, 2));
};

// GET: Retrieve all items
app.get('/api/items', (req, res) => {
  const items = readData();
  res.json(items);
});

// POST: Add a new item
app.post('/api/items', (req, res) => {
  const items = readData();
  const newItem = {
    id: items.length + 1,
    name: req.body.name
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json({Message: "Item Sent Successfully", Item: newItem});
});

// PUT: Update an existing item
app.put('/api/items/:id', (req, res) => {
  const items = readData();
  const itemId = parseInt(req.params.id);
  const item = items.find(i => i.id === itemId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  // Here, item is directly updated with the new values from the request body. Since item is a reference to an object inside items, updating item also updates the corresponding entry within items.
  item.name = req.body.name;
  item.id = req.body.id;
  writeData(items);
  res.json({Message: "Item Updated Successfully", item: item});
});

// DELETE: Remove an item
app.delete('/api/items/:id', (req, res) => {
  const items = readData();
  const itemId = parseInt(req.params.id);
  const itemIndex = items.findIndex(i => i.id === itemId);

  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const deletedItem = items.splice(itemIndex, 1);
  writeData(items);
  res.json({Message: "Item Deleted Successfully", item: deletedItem});
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
