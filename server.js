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

app.get('/', (req, res) => {
  res.json("Welcome To Express API");
})

// GET: Retrieve all items
app.get('/api/items', (req, res) => {
  const items = readData();
  res.json(items);
});

app.get('/api/items/:id', (req, res) => {
  const items = readData();
  const itemId = parseInt(req.params.id);
  const item = items.find(i => i.id === itemId);

  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }

  res.json({Message: "Item found Successful", item: item});
});

// POST: Add a new item
app.post('/api/items', (req, res) => {
  const items = readData();
  if(!req.body.name)
  {
    return res.status(400).json({Message: "Invalid Data"});
  }
  const newItem = {
    id: req.body.id,
    name: req.body.name
  };
  items.push(newItem);
  writeData(items);
  res.status(201).json({Message: "Item Created Successfully", Item: newItem});
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
  res.status(200).json({Message: "Item Updated Successfully", item: item});
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
  res.status(200).json({Message: "Item Deleted Successfully", item: deletedItem});
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
