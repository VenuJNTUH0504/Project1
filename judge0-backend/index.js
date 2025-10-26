const express = require('express'); 
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Public Judge0 API on RapidAPI
const JUDGE0_API = "https://judge0-ce.p.rapidapi.com";
const RAPIDAPI_KEY = "40d34e319dmshc20324759f66d59p1935c9jsnfb278858"; // Replace with your own if needed

app.post('/run', async (req, res) => {
  const { language_id, source_code, stdin } = req.body;
  try {
    // Submit code for execution
    const submission = await axios.post(`${JUDGE0_API}/submissions?base64_encoded=false&wait=false`, {
      language_id : 54, // C++ Language ID
      source_code:'#include <iostream>\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
      stdin
    }, {
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": RAPIDAPI_KEY,
        "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
      }
    });

    const token = submission.data.token;

    // Poll until execution is complete
    let result;
    do {
      await new Promise(resolve => setTimeout(resolve, 1000)); // wait 1 sec between polls
      const response = await axios.get(`${JUDGE0_API}/submissions/${token}?base64_encoded=false`, {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com"
        }
      });
      result = response.data;
    } while (result.status && result.status.id <= 2); // 1 = In Queue, 2 = Processing

    res.json(result);
  } catch (err) {
    console.error("Detailed error:", err.response?.data || err.message || err);
    res.status(500).send("Error executing code");
  }
  
});

// Serve static homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/cpp-homepage.html');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
