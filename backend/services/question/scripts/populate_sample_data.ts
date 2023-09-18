const fs = require("fs");

/**
 * This script uses sample_questions.json to populate the questions MongoDB using the CRUD API.
 */

const QUESTION_API = "http://localhost:3000"; // Update with your own question API URL

async function populateQuestions() {
  const questionJson = JSON.parse(fs.readFileSync("./sample_questions.json"));

  for (let question of questionJson) {
    try {
      const response = await fetch(`${QUESTION_API}/questions`, {
        method: "POST",
        body: JSON.stringify(question), // Ensure the body is a JSON string
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        console.log(`Question ${question.title} added successfully`);
      } else {
        console.error("Failed to add question:", response.statusText);
      }
    } catch (error) {
      console.error("Error while adding question:", error);
    }
  }
}

populateQuestions(); // Call the async function to start the process
