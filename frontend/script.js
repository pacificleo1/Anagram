document.addEventListener("DOMContentLoaded", function() {
  // Element references
  const userNameInput = document.getElementById("userName");
  const inputTextArea = document.getElementById("inputText");
  const generateBtn = document.getElementById("generateBtn");
  const resetBtn = document.getElementById("resetBtn");
  
  const nameError = document.getElementById("nameError");
  const textError = document.getElementById("textError");
  const resultsSection = document.getElementById("resultsSection");
  const resultsList = document.getElementById("resultsList");
  const newRequestBtn = document.getElementById("newRequestBtn");
  const form = document.getElementById("anagramForm");

  // Validate input fields based on PRD rules.
  function validateForm() {
    let valid = true;
    const nameValue = userNameInput.value.trim();
    const textValue = inputTextArea.value.trim();
    
    // Validate Name
    if (!nameValue) {
      nameError.textContent = "Name cannot be empty.";
      valid = false;
    } else {
      const words = nameValue.split(/\s+/);
      if (words.length > 10) {
        nameError.textContent = "Name cannot have more than 10 words.";
        valid = false;
      } else {
        for (let word of words) {
          if (word.length < 3) {
            nameError.textContent = "Each word must be at least 3 characters long.";
            valid = false;
            break;
          }
          if (word.length > 10) {
            nameError.textContent = "Each word must not exceed 10 characters.";
            valid = false;
            break;
          }
        }
        if (valid) {
          nameError.textContent = "";
        }
      }
    }
    
    // Validate Input Text
    if (!textValue) {
      textError.textContent = "Input text cannot be empty.";
      valid = false;
    } else {
      textError.textContent = "";
    }
    
    // Enable/Disable the Generate button
    generateBtn.disabled = !valid;
    return valid;
  }
  
  // Attach input event listeners
  userNameInput.addEventListener("input", validateForm);
  inputTextArea.addEventListener("input", validateForm);

  // Generate button click handler
  generateBtn.addEventListener("click", function() {
    if (!validateForm()) return;
    const data = {
      user_name: userNameInput.value.trim(),
      input_text: inputTextArea.value.trim()
    };

    generateBtn.disabled = true;
    generateBtn.textContent = "Generating...";

    // IMPORTANT: When testing locally, use "http://localhost:8000/generate-anagram"
    // Once deployed, replace with the deployed backend URL.
    fetch("http://localhost:8000/generate-anagram", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(err => { throw err; });
      }
      return response.json();
    })
    .then(result => {
      displayResults(result.anagrams);
      form.classList.add("hidden");
      resultsSection.classList.remove("hidden");
    })
    .catch(error => {
      alert("Error: " + (error.detail || "Something went wrong."));
    })
    .finally(() => {
      generateBtn.textContent = "Generate";
      validateForm();
    });
  });

  // Reset button clears errors and disables the Generate button.
  resetBtn.addEventListener("click", function() {
    form.reset();
    nameError.textContent = "";
    textError.textContent = "";
    generateBtn.disabled = true;
  });

  // "New Request" button returns to the form view.
  newRequestBtn.addEventListener("click", function() {
    form.classList.remove("hidden");
    resultsSection.classList.add("hidden");
    form.reset();
    generateBtn.disabled = true;
  });

  // Display the generated anagrams.
  function displayResults(anagrams) {
    resultsList.innerHTML = "";
    anagrams.forEach(anagram => {
      const li = document.createElement("li");
      li.textContent = anagram;
      resultsList.appendChild(li);
    });
  }
});
