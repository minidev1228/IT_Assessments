const sheetId = '1w0lYYsSFQHM4ZYrzMc7qEmv5sEz8xnVsIkKeZoItxb8'; // Your Google Sheet ID
const sheetRange = 'Sheet1!A:J'; // Adjust the range to your columns and sheet name (updated to include column J for input type)
const apiKey = 'AIzaSyCQotlAhXgCj1iNC-9O0RhHlWj00y1lipE'; // Your Google API key

const sectionIcons = document.getElementById('section-icons');
const formContent = document.getElementById('form-content');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
let currentStep = 0; // Start at the first section
let totalSteps = 0;
let formResponses = {}; // Object to store user responses

function checkFormSession() {
  const formResponses = localStorage.getItem('formResponses');

  if (!formResponses) {
    // If no form session is found, clear storage and proceed to load the form from the start
    localStorage.clear();
    sessionStorage.clear();
  }
}

// Call the function at the start of the script before any form initialization
checkFormSession();



// Embedded score ranges and recommendations directly in the script
const scoreMessages = [
  {
    min: 0,
    max: 30,
    comments: 'Your security posture needs significant improvement.',
    recommendations: ['Review your security policies.', 'Implement two-factor authentication.', 'Ensure all software is up to date.']
  },
  {
    min: 31,
    max: 60,
    comments: 'Your security posture is moderate but still needs improvement.',
    recommendations: ['Review employee training programs.', 'Conduct regular security audits.', 'Increase monitoring of network activity.']
  },
  {
    min: 61,
    max: 80,
    comments: 'Your security posture is good, but there’s room for improvement.',
    recommendations: ['Enhance data encryption methods.', 'Consider more frequent security assessments.', 'Engage with a third-party security consultant.']
  },
  {
    min: 81,
    max: 100,
    comments: 'Your security posture is strong. Keep up the good work!',
    recommendations: ['Maintain regular security updates.', 'Continue security awareness training.', 'Regularly review backup procedures.']
  }
];

// Function to redirect to the thank-you page after closing the modal
function redirectToThankYouPage() {
  window.location.href = 'thank-you.html'; // Replace with the actual thank-you page URL
}

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

  let sectionContent = [];
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
  iconContainer.innerHTML = `<i class="${iconClass}"></i>`;
  sectionIcons.appendChild(iconContainer);
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
      sectionHTML += `<div class="question-block">`;
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
        sectionHTML += `<input type="text" class="form-control" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
      } else if (q.inputType === 'email') {
        sectionHTML += `<input type="email" class="form-control" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
      } else if (q.inputType === 'phone') {
        sectionHTML += `<input type="tel" class="form-control" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
      } else if (q.inputType) {
        sectionHTML += `<input type="${q.inputType}" class="form-control" name="question-${section.sectionNumber}-${idx}" ${q.required ? 'required' : ''}>`;
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
  const totalQuestions = Object.keys(formResponses).length; // Total number of questions
  const maxPossibleScore = totalQuestions * 10; // Each question's "Yes" is worth 10 points

  // Loop through each response and calculate the score
  Object.values(formResponses).forEach(response => {
      if (response === 'Yes') {
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
  return Math.round(scorePercentage); // Round the score to an integer for display
}

// Function to create a gauge chart with the score
function createGaugeChart(score) {
  let gradientStops;

  // Apply different gradients based on score
  if (score < 20) {
    // Red gradient for score below 20
    gradientStops = `
      <stop offset="0%" stop-color="#ff0000" />  <!-- Red -->
      <stop offset="50%" stop-color="#ff6347" />  <!-- Lighter red -->
      <stop offset="100%" stop-color="#ff4500" /> <!-- Darker red -->
    `;
  } else if (score < 50) {
    // Blue gradient for score between 20 and 50
    gradientStops = `
      <stop offset="0%" stop-color="#1e90ff" />  <!-- Blue -->
      <stop offset="50%" stop-color="#6495ed" />  <!-- Lighter blue -->
      <stop offset="100%" stop-color="#4169e1" /> <!-- Darker blue -->
    `;
  } else {
    // Green gradient for score above 50
    gradientStops = `
      <stop offset="0%" stop-color="#32cd32" />  <!-- Green -->
      <stop offset="50%" stop-color="#66cdaa" />  <!-- Lighter green -->
      <stop offset="100%" stop-color="#2e8b57" /> <!-- Darker green -->
    `;
  }

  return `
    <svg width="200" height="120">
      <circle cx="100" cy="100" r="65" fill="none" stroke="#e5e5e5" stroke-width="25"></circle>
      <circle cx="100" cy="100" r="65" fill="none" stroke-width="25" stroke-linecap="round"
        stroke-dashoffset="${Math.PI * 2 * 65 * ((100 - score) / 100)}"
        stroke-dasharray="${Math.PI * 2 * 65}" stroke="url(#gaugeGradient)"></circle>
      <defs>
        <linearGradient id="gaugeGradient">
          ${gradientStops}
        </linearGradient>
      </defs>
    </svg>
    <p>Score: ${score}%</p>
  `;
}

// Function to get the appropriate message and recommendations based on the user's score
function getScoreMessage(score) {
  if (score <= 10) {
      return {
          comments: "Your IT infrastructure is in critical condition. Major issues are present that could severely impact your business operations. Without immediate intervention, your system is vulnerable to failures, breaches, and inefficiencies.",
          recommendations: [
              "Immediate Action Required: Engage an MSP urgently to assess and overhaul your entire IT environment.",
              "Security and Stability: Begin with strengthening basic security protocols and ensuring network reliability.",
              "Backup and Recovery Plan: Establish automated backup solutions and a disaster recovery plan.",
              "Ongoing Support Needed: Continuous monitoring and assistance are crucial to avoid further deterioration and ensure long-term business continuity."
          ]
      };
  } else if (score <= 20) {
      return {
          comments: "Your IT system has multiple weak points, making it difficult to maintain stability and security. Your current setup puts your business at risk for potential downtime and cyber threats.",
          recommendations: [
              "Urgent Support Needed: Partner with an MSP to address critical gaps in your infrastructure, especially in cybersecurity and network performance.",
              "Security Reinforcement: Implement stronger defenses such as multi-factor authentication and encryption.",
              "Proactive Monitoring: Set up monitoring tools to identify and resolve issues before they cause serious disruptions.",
              "Ongoing Assistance Required: Regular IT reviews and professional support are needed to bring your system up to standard and ensure smooth operations."
          ]
      };
  } else if (score <= 30) {
      return {
          comments: "Your IT infrastructure is operational but contains significant inefficiencies and vulnerabilities. Critical improvements are required to ensure long-term growth and stability.",
          recommendations: [
              "Strategic IT Partnership: Collaborate with an MSP to create a clear roadmap for resolving current issues and implementing future improvements.",
              "Security Upgrades: Address security vulnerabilities through comprehensive audits and improved defense mechanisms.",
              "Efficiency Boost: Upgrade aging systems and introduce more efficient processes like automation and cloud services.",
              "Long-Term Assistance: Ongoing IT support is essential to avoid potential setbacks and stay on track with industry standards."
          ]
      };
  } else if (score <= 40) {
      return {
          comments: "Your IT systems are functional but not optimized. You're experiencing gaps in efficiency and security that could hinder growth if not addressed.",
          recommendations: [
              "Proactive IT Assistance: Partner with an MSP to fine-tune your systems, focusing on efficiency, scalability, and advanced security protocols.",
              "Security Enhancements: Implement advanced measures such as intrusion detection systems and data encryption.",
              "Performance Tuning: Focus on improving network speed and server reliability to optimize daily operations.",
              "Continuous Improvement: IT is an evolving field; regular MSP support is vital to keep up with the latest technologies."
          ]
      };
  } else if (score <= 50) {
      return {
          comments: "Your IT environment is stable but far from reaching its full potential. Though there are no immediate critical issues, your infrastructure is not agile or secure enough to support future growth or protect against emerging threats.",
          recommendations: [
              "Strategic Optimization: Work with an MSP to optimize security, network infrastructure, and operational efficiency.",
              "Security Focus: Strengthen cybersecurity by adopting advanced threat detection systems and regular security audits.",
              "Scalability: Prepare your systems for future growth by evaluating cloud solutions and infrastructure upgrades.",
              "MSP Support Required: Regular IT assessments and improvements through professional support will ensure that your system evolves in line with business needs."
          ]
      };
  } else if (score <= 60) {
      return {
          comments: "Your IT systems are generally well-maintained but not without vulnerabilities. There’s a risk of falling behind if you don’t continue to improve security, efficiency, and scalability.",
          recommendations: [
              "Continuous IT Partnership: Work closely with an MSP to refine your infrastructure and keep up with technological advancements.",
              "Advanced Security Measures: Strengthen your security framework with real-time analytics and AI-driven threat detection.",
              "Future-Proofing: Begin planning for future business needs by upgrading systems for scalability and cloud readiness.",
              "Ongoing Maintenance Needed: Regular maintenance and audits by an MSP will be key to sustaining performance and security in the long term."
          ]
      };
  } else if (score <= 80) {
      return {
          comments: "Your IT setup is solid, but there are still areas that need attention to stay competitive in a fast-evolving industry. Stagnation can lead to vulnerabilities and inefficiencies.",
          recommendations: [
              "Stay Proactive: Partner with an MSP to regularly assess your infrastructure, ensuring it remains secure, scalable, and efficient.",
              "Security Innovations: Implement the latest security technologies, such as machine learning-based threat detection.",
              "Scalable Solutions: Focus on scalable IT solutions that will support long-term growth without excessive cost.",
              "Don’t Become Complacent: Continuous improvement and support are necessary to stay competitive."
          ]
      };
  } else if (score <= 100) {
      return {
          comments: "Your IT infrastructure is robust and well-optimized, but there is always room for improvement. Remaining at this level requires constant innovation and vigilant maintenance.",
          recommendations: [
              "Cutting-Edge Technologies: Work with an MSP to explore emerging technologies like AI, machine learning, and blockchain.",
              "Cybersecurity Vigilance: Stay proactive by implementing real-time monitoring and adaptive threat management systems.",
              "Optimize for Efficiency: Evaluate current IT processes to identify areas for automation or cost savings.",
              "Future Collaboration: Ongoing partnership with an MSP is essential to maintain your systems at an industry-leading level."
          ]
      };
  }
  return null; // Default message if no match is found
}

// Function to show the result modal
async function showResultModal() {
const formResponses = JSON.parse(localStorage.getItem('formResponses'));
const score = calculateScore(formResponses);

const resultModalContent = document.getElementById('result-modal-content');

// Fetch user name for personalization
const userName = formResponses['question-6-0']; // Assuming question 6.0 is the name field

const scoreMessage = getScoreMessage(score);

if (scoreMessage) {
  // Display personalized message and recommendations
  let recommendationsHTML = `<ul>`;
  scoreMessage.recommendations.forEach(rec => {
    recommendationsHTML += `<li>${rec}</li>`;
  });
  recommendationsHTML += `</ul>`;

  resultModalContent.innerHTML = `
    <h3>Hi ${userName},</h3>
    <p>${scoreMessage.comments}</p>
    ${createGaugeChart(score)}
    <h4>Your Recommendations:</h4>
    ${recommendationsHTML}
  `;
} else {
  resultModalContent.innerHTML = `<p>Unable to retrieve recommendations for your score.</p>`;
}

const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
resultModal.show();

resultModal._element.addEventListener('hidden.bs.modal', function () {
  redirectToThankYouPage(); // Redirect to the thank you page after modal closes
});
}

// Save form responses
function gatherFormResponses() {
  const formData = new FormData(document.querySelector('#multi-step-form'));
  const responses = {};

  document.querySelectorAll('.form-step').forEach((formStep, stepIndex) => {
    formStep.querySelectorAll('.question-block').forEach((block, index) => {
      const label = block.querySelector('.question-label').innerText;
      const inputs = block.querySelectorAll('input, select');
      const isCheckbox = block.querySelectorAll('input[type="checkbox"]').length > 0;

      // Handle multi-checkboxes
      if (isCheckbox) {
        const selectedOptions = [];
        block.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
          selectedOptions.push(checkbox.value);
        });
        responses[label] = selectedOptions.length ? selectedOptions.join(', ') : 'None';
      }
      // Handle dropdowns (including "Other")
      else if (inputs[0].tagName === 'SELECT') {
        const selectedValue = inputs[0].value;
        const nextInput = inputs[0].nextElementSibling;

        if (selectedValue === 'Other' && nextInput && nextInput.type === 'text') {
          responses[label] = nextInput.value || selectedValue;
        } else {
          responses[label] = selectedValue;
        }
      }
      // Handle text, email, phone, or other inputs
      else if (inputs[0].type !== 'checkbox') {
        responses[label] = inputs[0].value;
      }
    });
  });

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
      updateStepVisibility();
    } else {
      // Save responses to localStorage before redirecting
      gatherAndSaveFormResponses(); // Ensure data is saved correctly
      showResultModal(); // Show result modal after form submission
    }
  });
  
  
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      currentStep--;
      updateStepVisibility();
    }
  });
}

// Initialize form generation
fetchSheetData();

// -------------------------------
// New Code: Generating PDF 
// -------------------------------

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');  // A4 size PDF

  const formResponses = JSON.parse(localStorage.getItem('formResponses'));

  // User details
  const userName = formResponses['your-name-field-id'] || 'N/A';
  const userEmail = formResponses['your-email-field-id'] || 'N/A';
  const userPhone = formResponses['your-phone-field-id'] || 'N/A';
  const timestamp = new Date().toLocaleString();

  // Add title
  doc.setFontSize(22);
  doc.setFont('Helvetica', 'bold');
  doc.text("IT Assessment Report", 105, 20, { align: 'center' });

  // Add user details box with a cleaner layout
  doc.setFontSize(12);
  doc.setFont('Helvetica', 'normal');
  doc.text(`Name: ${userName}`, 20, 40);
  doc.text(`Email: ${userEmail}`, 20, 50);
  doc.text(`Phone: ${userPhone}`, 20, 60);
  doc.text(`Generated On: ${timestamp}`, 20, 70);
  doc.setDrawColor(0);
  doc.rect(10, 35, 190, 50); // Border for user details

  // Add score
  const score = calculateScore(formResponses);
  doc.setFontSize(18);
  doc.setFont('Helvetica', 'bold');
  doc.text(`Score: ${score}%`, 105, 100, { align: 'center' });

  // Add score recommendations
  const scoreMessage = getScoreMessage(score);
  if (scoreMessage) {
    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text(scoreMessage.comments, 20, 120, { maxWidth: 170 });
    
    let yPos = 130;
    scoreMessage.recommendations.forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec}`, 20, yPos, { maxWidth: 170 });
      yPos += 10;
    });
  }

  // Add form responses, formatted with borders and spacing
  doc.addPage();
  doc.setFontSize(16);
  doc.setFont('Helvetica', 'bold');
  doc.text("Form Responses", 105, 20, { align: 'center' });

  let yPos = 30;
  Object.entries(formResponses).forEach(([key, value], index) => {
    const displayValue = Array.isArray(value) ? value.join(', ') : value;

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'bold');
    doc.text(`${index + 1}. ${key.replace(/-/g, ' ')}`, 20, yPos); // Question in bold
    yPos += 7;
    
    doc.setFont('Helvetica', 'normal');
    doc.text(displayValue, 20, yPos); // Answer below question
    yPos += 15;
    
    doc.setDrawColor(0);
    doc.rect(10, yPos - 22, 190, 15); // Add border around each question/answer pair

    if (yPos > 270) {  // Add new page if content overflows
      doc.addPage();
      yPos = 20;
    }
  });

  // Save or return the PDF
  return doc.output('blob');
}

function gatherAndSaveFormResponses() {
  const formData = new FormData(document.querySelector('#multi-step-form'));
  const responses = {};

  document.querySelectorAll('.form-step').forEach((formStep, stepIndex) => {
    formStep.querySelectorAll('.question-block').forEach((block, index) => {
      const label = block.querySelector('.question-label').innerText.trim();
      const inputs = block.querySelectorAll('input, select');
      const isCheckbox = block.querySelectorAll('input[type="checkbox"]').length > 0;

      // Handle multi-checkboxes
      if (isCheckbox) {
        const selectedOptions = [];
        block.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
          selectedOptions.push(checkbox.value);
        });
        responses[label] = selectedOptions.length ? selectedOptions.join(', ') : 'None';
      }
      // Handle dropdowns (including "Other")
      else if (inputs[0].tagName === 'SELECT') {
        const selectedValue = inputs[0].value;
        const nextInput = inputs[0].nextElementSibling;

        if (selectedValue === 'Other' && nextInput && nextInput.type === 'text') {
          responses[label] = nextInput.value || selectedValue;
        } else {
          responses[label] = selectedValue;
        }
      }
      // Handle text, email, phone, or other inputs
      else if (inputs[0].type !== 'checkbox') {
        responses[label] = inputs[0].value;
      }
    });
  });

  localStorage.setItem('formResponses', JSON.stringify(responses)); // Save to localStorage
  return responses;
}




// Send the PDF via EmailJS
// Initialize EmailJS with your public key
// Initialize EmailJS with your public key
emailjs.init('avayfpWYmzo9Y2Ej3'); // Use your actual public key here

// Function to send email with PDF attachment
function sendEmailWithPDF(pdfBlob) {
  const reader = new FileReader();

  reader.onloadend = function () {
    const base64data = reader.result.split(',')[1]; // Get base64 from data URL

    // Fetch the form responses from localStorage
    const formResponses = JSON.parse(localStorage.getItem('formResponses'));

    // Fetch the correct values from formResponses
    const userName = formResponses['Full Name'] || 'No Name Provided'; // Replace with actual field name
    const userEmail = formResponses['Email address'] || 'No Email Provided'; // Replace with actual field name
    const userPhone = formResponses['Phone Number'] || 'No Phone Provided'; // Replace with actual field name

    // Ensure the correct email addresses are used
    const recipientEmails = "nisargnaik@gmail.com, ayra.upwork@gmail.com";

    // Send email via EmailJS
    emailjs.send("service_lnktodv", "template_168xvig", {
      to_email: recipientEmails, // Send to the specified emails
      user_name: userName,       // Pass the user's name to the email template
      user_email: userEmail,     // Pass the user's email to the template
      user_phone: userPhone,     // Pass the user's phone number to the template
      message: "Please find attached your IT Assessment Report.", // Custom message
      pdf_link: "Link to download the PDF if hosted elsewhere",  // Optional: include a PDF link if it's hosted online
      attachment: base64data     // Base64 data for the PDF attachment
    }).then(response => {
      console.log('Email sent successfully!', response.status, response.text);
    }).catch(err => {
      console.error('Error sending email', err); // Log the complete error
    });
  };

  reader.readAsDataURL(pdfBlob); // Convert the PDF Blob to base64
}

// Function to generate PDF and send it via email
async function generatePDFAndEmail() {
  const pdfBlob = await generatePDF();  // Generate PDF and get the Blob
  sendEmailWithPDF(pdfBlob);  // Send the email with the PDF Blob
}

// Function to gather form responses from the form
function gatherFormResponses() {
  const formData = new FormData(document.querySelector('#multi-step-form'));
  const responses = {};

  document.querySelectorAll('.form-step').forEach((formStep, stepIndex) => {
    formStep.querySelectorAll('.question-block').forEach((block, index) => {
      const label = block.querySelector('.question-label').innerText.trim();
      const inputs = block.querySelectorAll('input, select');
      const isCheckbox = block.querySelectorAll('input[type="checkbox"]').length > 0;

      // Handle multi-checkboxes
      if (isCheckbox) {
        const selectedOptions = [];
        block.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
          selectedOptions.push(checkbox.value);
        });
        responses[label] = selectedOptions.length ? selectedOptions.join(', ') : 'None';
      }
      // Handle dropdowns (including "Other")
      else if (inputs[0].tagName === 'SELECT') {
        const selectedValue = inputs[0].value;
        const nextInput = inputs[0].nextElementSibling;

        if (selectedValue === 'Other' && nextInput && nextInput.type === 'text') {
          responses[label] = nextInput.value || selectedValue;
        } else {
          responses[label] = selectedValue;
        }
      }
      // Handle text, email, phone, or other inputs
      else if (inputs[0].type !== 'checkbox') {
        responses[label] = inputs[0].value;
      }
    });
  });

  return responses;
}

// Function to show the result modal and send the email
async function showResultModalAndSendEmail() {
  // Gather form responses and save to localStorage
  const formResponses = gatherFormResponses();
  localStorage.setItem('formResponses', JSON.stringify(formResponses));

  // Show the result modal
  showResultModal();

  // Send email with the PDF attachment
  await generatePDFAndEmail();
}

// Event listener for form submission
document.getElementById('multi-step-form').addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent default form submission
  showResultModalAndSendEmail(); // Show the modal and send the email
});

// Remove unnecessary button event listener if you want to trigger on submit directly
// document.getElementById('send-email-btn').addEventListener('click', generatePDFAndEmail);


// Add download button to the modal
// Ensure the modal exists before adding the event listener
const modalFooter = document.querySelector('.modal-footer');
if (modalFooter) {
  const downloadBtn = document.createElement('button');
  downloadBtn.innerText = 'Download PDF';
  downloadBtn.classList.add('btn', 'btn-primary', 'mt-3');
  
  downloadBtn.addEventListener('click', async () => {
    const pdfBlob = await generatePDF();  // Generate the PDF
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = 'IT_Assessment_Report.pdf'; // Name of the PDF file
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link); // Clean up the link after download
  });

  modalFooter.appendChild(downloadBtn);
} else {
  console.error('Modal footer not found, could not append download button');
}

function generateReportHtml() {
  // Get form responses from localStorage
  const formResponses = JSON.parse(localStorage.getItem('formResponses'));

  // Construct a query string from the responses
  const userName = formResponses['your-name-field-id'] || 'N/A';
  const userEmail = formResponses['your-email-field-id'] || 'N/A';
  const userPhone = formResponses['your-phone-field-id'] || 'N/A';
  const score = calculateScore(formResponses);
  const questions = Object.entries(formResponses).map(([key, value]) => ({
    question: key.replace(/-/g, ' '),
    answer: Array.isArray(value) ? value.join(', ') : value
  }));

  // Create a URL with query parameters
  const reportHtmlUrl = `pdf-template.html?name=${encodeURIComponent(userName)}&email=${encodeURIComponent(userEmail)}&phone=${encodeURIComponent(userPhone)}&score=${encodeURIComponent(score)}&questions=${encodeURIComponent(JSON.stringify(questions))}`;

  // Open the report in a new tab
  window.open(reportHtmlUrl, '_blank');
}

