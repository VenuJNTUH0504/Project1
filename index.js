const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Piston API endpoint
const PISTON_API = "https://emkc.org/api/v2/piston/execute";

// Endpoint to execute code
app.post('/execute', async (req, res) => {
  const { code, language, stdin } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required.' });
  }
  // Language map (Frontend → Piston language names)
const languageMap = {
 cpp: { name: 'c++', version: '10.2.0' },
  python: { name: 'python3', version: '3.10.0' },
  javascript: { name: 'javascript', version: '18.15.0' },
  java: { name: 'java', version: '15.0.2' },
  golang: { name: 'go', version: '1.20.5' }
};

  const mappedLanguage = languageMap[language.toLowerCase()];
  if (!mappedLanguage) {
    return res.status(400).json({ error: 'Unsupported language.' });
  }

  try {
    const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
      language:"c++",
      version: mapped.vrsion,
      source:"#include<iostream>\nint main() { std::cout << \"Hi\"; return 0; }",
      stdin: stdin || ''
    });

    res.json({
      output: response.data.output,
      stdout: response.data.stdout,
      stderr: response.data.stderr,
      exitCode: response.data.code,
      signal: response.data.signal,
      language: mapped.name,
      version: mapped.version
    });
  } catch (error) {
  console.error("Piston API error:", {
    message: error.message,
    status: error.response?.status,
    data: error.response?.data,
  });
  res.status(500).json({ error: 'Failed to execute code.' });
}
});

// Serve static files
app.use(express.static(__dirname));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cpp-homepage.html'));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
