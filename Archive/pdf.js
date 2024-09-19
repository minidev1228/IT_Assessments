// Function to generate and download the PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
  
    // Get form responses from localStorage
    const formResponses = JSON.parse(localStorage.getItem('formResponses'));
  
    // Get score details
    const score = calculateScore(formResponses);
    const scoreMessage = getScoreMessage(score);
    
    let yPosition = 20; // To track the vertical position in the PDF
  
    // Title
    doc.setFontSize(22);
    doc.text('IT Assessment Result', 105, yPosition, null, null, 'center');
    yPosition += 20;
  
    // Score Section
    doc.setFontSize(18);
    doc.text('Your Score', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(16);
    doc.text(`Score: ${score}%`, 20, yPosition);
    yPosition += 10;
    doc.text(`${scoreMessage.comments}`, 20, yPosition);
    yPosition += 10;
  
    // Recommendations
    if (scoreMessage && scoreMessage.recommendations) {
      yPosition += 10;
      doc.setFontSize(18);
      doc.text('Recommendations', 20, yPosition);
      yPosition += 10;
  
      doc.setFontSize(14);
      scoreMessage.recommendations.forEach(rec => {
        doc.text(`- ${rec}`, 20, yPosition);
        yPosition += 10;
      });
    }
  
    // Add a section separator
    yPosition += 20;
    doc.setFontSize(18);
    doc.text('Your Answers', 20, yPosition);
    yPosition += 10;
  
    // Capture and print the form responses (question and answers)
    Object.keys(formResponses).forEach((key, index) => {
      // Find the question label by targeting the corresponding label for the input
      const questionLabel = document.querySelector(`label[for="${key}"]`).innerText;
      const userAnswer = formResponses[key];
      
      doc.setFontSize(14);
      doc.text(`${index + 1}. ${questionLabel}`, 20, yPosition);
      yPosition += 10;
  
      doc.setFontSize(12);
      doc.text(`Answer: ${userAnswer}`, 20, yPosition);
      yPosition += 10;
      
      // Add some space between questions
      yPosition += 5;
  
      // If the content is getting too close to the bottom, add a new page
      if (yPosition >= 270) {
        doc.addPage();
        yPosition = 20; // Reset for the next page
      }
    });
  
    // Download the PDF
    doc.save('IT_Assessment_Result.pdf');
  }
  
  // Add event listener for the Download PDF button in the modal
  document.getElementById('download-pdf').addEventListener('click', downloadPDF);
  