const sheetId = '1w0lYYsSFQHM4ZYrzMc7qEmv5sEz8xnVsIkKeZoItxb8'; // Your Google Sheet ID
const sheetRange = 'Sheet1!A:J'; // Adjust the range to your columns and sheet name (updated to include column J for input type)
const apiKey = 'AIzaSyCQotlAhXgCj1iNC-9O0RhHlWj00y1lipE'; // Your Google API key
const webAppUrl = 'https://script.google.com/macros/s/AKfycbwvsj2j_A5Sy_-uDO2eYqZmbcuQ0BVIRfD58wFBLXY-7RhkujRI0ButoEMKObLMU91wbw/exec'; // Google Apps Script Web App URL

const sectionIcons = document.getElementById('section-icons');
const formContent = document.getElementById('form-content');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
let currentStep = 0; // Start at the first section
let totalSteps = 0;
let formResponses = {}; // Object to store user responses
let sectionContent = [];
let results = [];
let finalResult = [];
let myScore = 0;
let isSubmitted = false;

// Fetch the data from Google Sheets
async function fetchSheetData() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.values) {
      generateForm(data.values);
    } else {
      console.error('No valid data returned from the Google Sheets API');
    }
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
  }
}

// Generate the multi-step form based on the data
function generateForm(data) {
  if (!data || data.length === 0) {
    console.error('No data found in the spreadsheet');
    return;
  }

  // let sectionContent = [];
  let currentSection = null;

  // Start iterating from index 1 to skip the header (row 0)
  data.slice(1).forEach((row, index) => {
    const [section, icon, title, question, underQuestion, dropdownType, checkboxType, dropdownOther, required, inputType] = row;

    // Check if a new section should be created: Only when Column A, B, and C have values
    if (section && icon && title) {
      // Push the previous section if it exists
      if (currentSection) {
        sectionContent.push(currentSection);
      }

      // Create a new section
      currentSection = {
        sectionNumber: sectionContent.length + 1,
        icon: icon || '',
        title: title || '',
        questions: [],
        answers: []
      };

      createSectionIcon(icon, sectionContent.length + 1); // Create section icon for progress
    }

    // If the current section exists, add questions from Column D onwards until a blank row
    if (currentSection && question) {
      const isRequired = required && required.trim() === '*' ? true : false; // Check if the question is mandatory
      const questionBlock = {
        question: question || '',
        underQuestion: underQuestion || '',
        dropdownType: dropdownType || '',
        checkboxType: checkboxType || '',
        dropdownOther: dropdownOther || '',
        required: isRequired,
        inputType: inputType || ''  // Read input type from column J (leave blank if none provided)
      };

      currentSection.questions.push(questionBlock);
    }
  });

  // Push the final section if it exists
  if (currentSection) sectionContent.push(currentSection);

  totalSteps = sectionContent.length;
  createFormSections(sectionContent);
}

// Create the section icons for the navigation
function createSectionIcon(iconClass, sectionNumber) {
  const iconContainer = document.createElement('div');
  iconContainer.classList.add('icon-container', 'inactive'); // Inactive by default
  if (sectionNumber === 1) iconContainer.classList.add('active'); // The first one is active initially
  iconContainer.innerHTML = `
    <i class="${iconClass}"></i>
  `;
  sectionIcons.appendChild(iconContainer);
}

// Add current result to final result array

function addResult() {
  console.log(`This is step ${currentStep}`);

  let currentResult = {};

  let beforeStep = currentStep - 1;
  let section = sectionContent[beforeStep];
  let questions = section.questions;
  let contents = formContent.children[beforeStep].children;

  results.push([`${section.sectionNumber}. ${section.title}`]);
  let rlt = [];
  // currentResult
  questions.forEach((question, idx) => {
    let title = `${idx + 1}. ${question.question}`;
    let answer = "";
    if(question.checkboxType) {
      // console.log("1======>", title);
      let checkBoxs = contents[idx + 1].children;
      // checkBoxs = checkBoxs.keys(checkBoxs).map((key) => [key, checkBoxs[key]]);
      let IsInit = true;
      for(let i = 1; i < checkBoxs.length; i++){
        let box = checkBoxs[i];
        if(box.children[0].checked){
          answer = `${answer} ${IsInit === true ? "" : ","} ${box.children[1].innerText}`;
          IsInit = false;
        }
      }
    } else if(question.dropdownType || question.dropdownOther) {
      // console.log("2======>", title);
      console.log(contents[idx + 1].getElementsByTagName("select")[0].value);
      answer = contents[idx + 1].getElementsByTagName("select")[0].value;
    } else {
      // console.log("3======>", title);
      answer = contents[idx + 1].getElementsByTagName("input")[0].value;
    }
    rlt.push(title);
    rlt.push(answer);
    rlt.push("");
  })
  results.push(rlt);
  console.log(questions);
  console.log(contents);
  console.log(currentResult);
  console.log(JSON.stringify(results));
}

// Update the visibility of sections (steps) and icons

function updateStepVisibility() {

  document.querySelectorAll('.form-step').forEach((step, index) => {
    step.style.display = index === currentStep ? 'block' : 'none'; // Show only the current step
  });

  document.querySelectorAll('.icon-container').forEach((icon, index) => {
    if (index === currentStep) {
      icon.classList.add('active');  // Make the current step active
      icon.classList.remove('completed', 'inactive');
    } else if (index < currentStep) {
      icon.classList.add('completed');  // Mark as completed if passed
      icon.classList.remove('active', 'inactive');
    } else {
      icon.classList.add('inactive');  // Inactive for upcoming sections
      icon.classList.remove('active', 'completed');
    }
  });

  prevBtn.disabled = currentStep === 0;  // Disable the previous button on the first step
  nextBtn.textContent = currentStep === totalSteps - 1 ? 'Submit' : 'Next';  // Change Next to Submit on the last step
}

// Create the form sections (each section is treated as a step)
function createFormSections(sectionContent) {
  sectionContent.forEach((section, index) => {
    const formStep = document.createElement('div');
    formStep.classList.add('form-step');
    formStep.style.display = index === 0 ? 'block' : 'none'; // Show only the first step initially

    let sectionHTML = `<h3>${section.sectionNumber}. ${section.title}</h3>`;

    section.questions.forEach((q, idx) => {
      sectionHTML += `<div class="question-div">`;
      sectionHTML += `<label for="question-${section.sectionNumber}-${idx}"><span class="question-label">${q.question}`;
      
      // Add asterisk if the question is required
      if (q.required) {
        sectionHTML += ' <span style="color: red;">*</span>';
      }

      sectionHTML += `</span></label>`;
      
      if (q.underQuestion) {
        sectionHTML += `<p class="small-desc" style="font-style: italic;">${q.underQuestion}</p>`;
      }

      // Only add input fields if inputType exists, otherwise use dropdown/checkbox as before
      if (q.inputType === 'text') {
        sectionHTML += `<input type="text" class="form-control answer" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
      } else if (q.inputType === 'email') {
        sectionHTML += `<input type="email" class="form-control answer" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
      } else if (q.inputType === 'phone') {
        sectionHTML += `<input type="tel" class="form-control answer" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
      } else if (q.inputType) {
        sectionHTML += `<input type="${q.inputType}" class="form-control answer" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
      } else if (q.dropdownType) {
        let dropdown = `<select class="form-select" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
        q.dropdownType.split(',').forEach(option => {
          dropdown += `<option value="${option}">${option}</option>`;
        });
        dropdown += `</select>`;
        sectionHTML += dropdown;
      } else if (q.checkboxType) {
        q.checkboxType.split(',').forEach(option => {
          const checkboxId = `question-${section.sectionNumber}-${idx}-${option}`;
          sectionHTML += `<div class="form-check">
            <input class="form-check-input" id="${checkboxId}" type="checkbox" name="question-${section.sectionNumber}-${idx}" value="${option}" ${q.required ? 'required' : ''}>
            <label class="form-check-label" for="${checkboxId}">${option}</label>
          </div>`;
        });
      } else if (q.dropdownOther) {
        let dropdown = `<select class="form-select dropdown-other" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
        q.dropdownOther.split(',').forEach(option => {
          dropdown += `<option value="${option}">${option}</option>`;
        });
        dropdown += `<option value="Other">Other</option></select>`;
        dropdown += `<input type="text" class="form-control other-input" placeholder="Please specify" style="display:none;" name="other-question-${section.sectionNumber}-${idx}">`;
        sectionHTML += dropdown;
      }

      sectionHTML += `</div>`; // Close question block
    });

    formStep.innerHTML = sectionHTML;
    console.log(formStep);
    formContent.appendChild(formStep);
  });

  addEventListeners();
}

// Validate the current step for required fields
function validateCurrentStep() {
  const currentFormStep = document.querySelectorAll('.form-step')[currentStep]; // Use currentStep to target active form step
  const requiredFields = currentFormStep.querySelectorAll('[required]');
  let valid = false;

  requiredFields.forEach((field) => {
    if (field.type === 'checkbox' || field.type === 'radio') {
      if (field.checked) {
        valid = true;
      }
    } else if (field.value !== '') {
      valid = true;
    }
  });

  if (!valid && requiredFields.length > 0) { // Check if there are required fields
    alert('Please complete all required fields.');
    return false;
  }

  return true;
}

// Function to calculate total score based on form responses
function calculateScore(formResponses) {
    let totalScore = 0;
    let c = 0;
    const totalQuestions = Object.keys(formResponses).length; // Total number of questions
    const maxPossibleScore = totalQuestions * 10; // Each question's "Yes" is worth 10 points

    // Loop through each response and calculate the score
    Object.values(formResponses).forEach(response => {
        if (response === 'Yes') {
          c++;  
          totalScore += 10; // Full points for "Yes"
        } else if (response === 'No') {
            totalScore += 0;  // No points for "No"
        } else if (response === 'Unsure') {
            totalScore += 5;  // Partial points for "Unsure"
        } else if (Array.isArray(response)) {
            totalScore += response.includes('Yes') ? 10 : 0;
        }
    });

    const scorePercentage = (totalScore / maxPossibleScore) * 100; // Calculate the percentage
    console.log(c, totalScore, maxPossibleScore, scorePercentage);
    return Math.round(scorePercentage); // Round the score to an integer for display
}

// Function to create a gauge chart
function createGaugeChart(score) {
  myScore = score;
  return `
    <svg width="200" height="120">
      <circle cx="100" cy="100" r="65" fill="none" stroke="#e5e5e5" stroke-width="25"></circle>
      <circle cx="100" cy="100" r="65" fill="none" stroke-width="25" stroke-linecap="round"
        stroke-dashoffset="${Math.PI * 2 * 65 * ((100 - score) / 100)}"
        stroke-dasharray="${Math.PI * 2 * 65}" stroke="url(#gaugeGradient)"></circle>
      <defs>
        <linearGradient id="gaugeGradient">
          <stop offset="0%" stop-color="red" />
          <stop offset="50%" stop-color="orange" />
          <stop offset="100%" stop-color="green" />
        </linearGradient>
      </defs>
    </svg>
    <p>Score: ${score}%</p>
  `;
}

// Function to show the result modal
function showResultModal() {
  const formResponses = JSON.parse(localStorage.getItem('formResponses'));
  console.log(formResponses);
  const score = calculateScore(formResponses);

  const resultModalContent = document.getElementById('result-modal-content');
  
  // Fetch user name for personalization
  const userName = formResponses['question-6-0']; // Assuming question 6.0 is the name field
  
  // Set modal content with personalized message and gauge chart
  resultModalContent.innerHTML = `
    <h3>Hi ${userName},</h3>
    <p>Your assessment is complete. Your score is:</p>
    ${createGaugeChart(score)}
  `;

  const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
  resultModal.show();
  displayComment(score);
}

// Save form responses
function gatherFormResponses() {
  const formData = new FormData(document.querySelector('#multi-step-form'));
  const responses = {};
  for (const [key, value] of formData.entries()) {
    responses[key] = value;
  }
  return responses;
}

// Add event listeners for navigation and "Other" dropdown option
function addEventListeners() {
  document.querySelectorAll('.dropdown-other').forEach(select => {
    select.addEventListener('change', function () {
      const input = this.nextElementSibling;
      input.style.display = this.value === 'Other' ? 'block' : 'none';
    });
  });

  nextBtn.addEventListener('click', () => {
    if (!validateCurrentStep()) return; // Prevent if validation fails
    if (currentStep < totalSteps - 1) {
        currentStep++;
        addResult();
        updateStepVisibility();
    } else {
        // Save responses to localStorage before redirecting
        const formResponses = gatherFormResponses();
        localStorage.setItem('formResponses', JSON.stringify(formResponses));
        // Show result modal dynamically after form submission
        showResultModal();
        currentStep++;  
        addResult();
        saveResult();
    }
  });
  
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      
      results.pop(results[results.length]);
      results.pop(results[results.length]);
      
      currentStep--;
      updateStepVisibility();
    }
  });
}

function saveResult() {
  if(isSubmitted) return;
  isSubmitted = true;
  $.ajax({
    url: "https://it-assessments-backend.vercel.app/", // URL to send the request to
    type: "POST", // Type of request
    // dataType: "json",
    data: {rlt: results}, // Expected data type from the server
    success: function(data) {
        console.log(data); // Handle the response data
    },
    error: function(xhr, status, error) {
        console.error("Error: " + error); // Handle errors
    }
  });
}
// Initialize form generation
fetchSheetData();
