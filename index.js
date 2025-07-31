// backend\index.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();  // Load environment variables from .env file
const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
  origin: [
    'http://localhost:3000', // your frontend dev server
    'https://v0-next-js-frontend-build-iota.vercel.app/', // your production frontend (if any)
  ],
  credentials: true, // if you use cookies or authentication
};

app.use(cors(corsOptions));

//Routes
const authRoutes = require('./routes/auth');

const userRoutes = require('./routes/users');

const workOrdersRoute = require('./routes/workOrders');

const preventiveMaintenanceRoutes = require('./routes/preventiveMaintenanceRoutes');

const assetRoutes = require('./routes/assetRoutes');

const requestRoutes = require('./routes/requests');

const stationsRoutes = require('./routes/stations'); // Import the stations routes
 
// Routes
app.use('/api/auth', authRoutes);

app.use('/api/users', userRoutes);

app.use('/api/workorders', workOrdersRoute);

app.use('/api/stations', stationsRoutes);

app.use('/api/preventivemaintenance', preventiveMaintenanceRoutes);

app.use('/api/assets', assetRoutes);

app.use('/api/requests', requestRoutes);


// Connect to MongoDB using the correct environment variable name
const PORT = process.env.PORT || 5002;
console.log(`Connecting to MongoDB on port ${PORT}...`);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
