const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes');

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = 'mongodb+srv://jolteddesigns:smaggascXOl7mwfq@monolith.uf7w4hk.mongodb.net/?retryWrites=true&w=majority&appName=Monolith';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/profiles', profileRoutes);

// Basic route for testing
app.get('/', (req, res) => {
  res.send('SUI Monolith Backend is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 