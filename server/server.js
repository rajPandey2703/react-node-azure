require('dotenv').config();
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
require('dotenv').config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const apiKey = process.env.API_KEY;

const app = express();
const PORT = 5000;

// Enable CORS (allow requests from the frontend)
app.use(cors());

app.get('/', (req, res) => {
  res.json({ message: 'Hello from Express backend!' });
 
});


app.post('/api/upload', upload.single('file'), async (req, res) => {
   const formData = new FormData();
  
   if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
   
    formData.append('images', req.file.buffer, {
      filename: req.file.originalname,
    });
   

     const response = await axios.post(
        "https://plant.id/api/v3/health_assessment",
        formData,
        {
          headers: {
          'Api-Key': apiKey, // Correct header name
          ...formData.getHeaders(), // Required for multipart/form-data
        },
        }
      );
    

    res.json(response.data);
    
  } catch (err) {
    
    console.error('Upload error:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
