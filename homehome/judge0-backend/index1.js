const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cpp-homepage.html'));
});

// Handle code execution
app.post('/run', async (req, res) => {
  const sourceCode = req.body.code;

  try {
    const response = await axios.post('https://emkc.org/api/v2/piston/execute', {
      language: "cpp",
      version: "10.2.0", // Optional, Piston auto-selects if not provided
      files: [{ name: "main.cpp", content: sourceCode }]
    });

    res.send(`<pre>${response.data.output}</pre><br><a href="/">Back</a>`);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error running code.');
  }
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
