require('dotenv').config();
const express = require('express');
const app = express();
const { connectDB } = require('./src/config/db');

connectDB();

// Define a route
app.get('/ping', (req, res) => {
    const data = { message: 'Hello, World!', success: true };
    res.json(data);
});

// Import routes
const authRoutes = require('./src/routes/auth');
const todoRoutes = require('./src/routes/todos');

app.use(express.json());

// Use routes
app.use('/', authRoutes);
app.use('/api/tasks', todoRoutes);


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
