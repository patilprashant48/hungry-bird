const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const database = require('./config/database');
const contactRoutes = require('./routes/contactRoutes');
const groupRoutes = require('./routes/groupRoutes');

// ... after app.use('/api/contacts', contactRoutes);
app.use('/api/groups', groupRoutes);


const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Serve static frontend files correctly
app.use(express.static(path.join(__dirname, '../public')));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect MySQL
database();

// API routes
app.use('/api/contacts', contactRoutes);

// Catch-all route (optional)
// If user visits "/", serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
