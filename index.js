const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS view engine and views folder
app.set("view engine", "ejs");
app.set("views", "./views"); // Ensure your EJS files are in the 'views' folder

// Validate API key
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.error("API_KEY is not set in environment variables");
    process.exit(1);
}

// Serve static files from the 'public' folder (for CSS, JS, etc.)
app.use(express.static("public"));

// GET route for rendering the main page
app.get("/", (req, res) => {
  res.render("index"); // Renders the 'index.ejs' file from the 'views' folder
});

// POST endpoint for handling the chat input
app.post("/", async (req, res) => {
  const { chat } = req.body; // Assuming the frontend sends the message as "chat"

  console.log(req.body); // Log the request body for debugging

  if (!chat) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    // Initialize GoogleGenerativeAI with the API key
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate AI response based on user input
    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: chat }]}],
    });

    const response = result.response.text();
    console.log("AI Response:", response);
    
    res.json({ response: response });
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Failed to generate AI response" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});