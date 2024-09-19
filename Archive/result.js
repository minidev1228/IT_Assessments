// Function to calculate total score based on form responses
function calculateScore(formResponses) {
    let totalScore = 0;
    let maxScore = 0;

    Object.values(formResponses).forEach(response => {
        // Handle different input types accordingly
        if (typeof response === 'string') {
            if (response.trim() === '') return; // Skip empty responses

            if (response === 'Yes') {
                totalScore += 1; // 1 point for "Yes"
            }
            // No points for "No" and "Unsure"
        } else if (Array.isArray(response)) {
            // For checkbox or multiple-choice fields (assumed as arrays)
            if (response.length > 0) {
                totalScore += 1; // If any option is selected, give 1 point
            }
        }
        maxScore += 1; // Each question adds 1 to maxScore
    });

    // Prevent division by zero
    if (maxScore === 0) {
        console.warn('No questions available for scoring.');
        return 0;
    }

    const scorePercentage = (totalScore / maxScore) * 100; // Calculate the percentage
    return Math.round(scorePercentage); // Round to the nearest integer for cleaner display
}

// Function to render the gauge chart using ZingChart
function renderGaugeChart(score) {
    ZC.LICENSE = ["569d52cefae586f634c54f86dc99e6a9", "b55b025e438fa8a98e32482b5f768ff5"];

    const myConfig = {
        type: "gauge",
        globals: {
            fontSize: 25
        },
        plotarea: {
            marginTop: 80
        },
        plot: {
            size: '100%',
            valueBox: {
                placement: 'center',
                text: '%v%', // Show percentage
                fontSize: 35,
                rules: [
                    { rule: '%v >= 80', text: '%v%<br>EXCELLENT' },
                    { rule: '%v < 80 && %v >= 60', text: '%v%<br>GOOD' },
                    { rule: '%v < 60 && %v >= 40', text: '%v%<br>FAIR' },
                    { rule: '%v < 40', text: '%v%<br>POOR' }
                ]
            }
        },
        scaleR: {
            aperture: 180,
            minValue: 0,
            maxValue: 100,
            step: 10,
            center: { visible: false },
            tick: { visible: false },
            labels: ['0', '', '', '', '', '', '40', '60', '80', '100'],
            ring: {
                size: 50,
                rules: [
                    { rule: '%v <= 20', backgroundColor: '#E53935' }, // Red for Poor
                    { rule: '%v > 20 && %v < 50', backgroundColor: '#1E90FF' }, // Blue for Fair
                    { rule: '%v >= 50', backgroundColor: '#66BB6A' } // Green for Good and Excellent
                ]
            }
        },
        series: [
            {
                values: [score], // Display the calculated score
                backgroundColor: 'black',
                indicator: [10, 10, 10, 10, 0.75], // Indicator settings
                animation: { effect: 2, method: 1, sequence: 4, speed: 900 } // Animation config
            }
        ]
    };

    zingchart.render({
        id: 'myChart',
        data: myConfig,
        height: 500,
        width: '100%'
    });
}

// Function to get the appropriate message and recommendations based on the user's score
function getScoreMessage(score) {
    if (score <= 20) {
        return {
            comments: "Your IT infrastructure is in critical condition. Immediate intervention is required.",
            recommendations: [
                "Engage with an MSP urgently to assess your entire IT environment.",
                "Strengthen security protocols and ensure network reliability.",
                "Establish a backup and disaster recovery plan.",
                "Implement ongoing monitoring and assistance."
            ]
        };
    } else if (score <= 50) {
        return {
            comments: "Your IT system has multiple weak points, making stability difficult to maintain.",
            recommendations: [
                "Partner with an MSP to address gaps in your infrastructure.",
                "Implement stronger defenses such as multi-factor authentication.",
                "Set up monitoring tools to resolve issues proactively."
            ]
        };
    } else if (score <= 80) {
        return {
            comments: "Your IT setup is solid but needs some attention to stay competitive.",
            recommendations: [
                "Partner with an MSP for regular assessments.",
                "Implement the latest security technologies.",
                "Focus on scalable IT solutions for long-term growth."
            ]
        };
    } else {
        return {
            comments: "Your IT infrastructure is robust and optimized. Keep up the good work!",
            recommendations: [
                "Maintain regular security updates and training.",
                "Continue collaborating with an MSP to ensure future growth."
            ]
        };
    }
}

// Function to show the result modal with recommendations
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
            ${renderGaugeChart(score)}
            <h4>Your Recommendations:</h4>
            ${recommendationsHTML}
        `;
    } else {
        resultModalContent.innerHTML = `<p>Unable to retrieve recommendations for your score.</p>`;
    }

    const resultModal = new bootstrap.Modal(document.getElementById('resultModal'));
    resultModal.show();
}

// Fetch form responses from localStorage and show modal
const formResponses = JSON.parse(localStorage.getItem('formResponses'));

if (formResponses && Object.keys(formResponses).length > 0) {
    const score = calculateScore(formResponses);
    
    // Ensure score is valid before rendering the chart
    if (score >= 0 && score <= 100) {
        renderGaugeChart(score);
    } else {
        console.error('Invalid score calculated.');
        const resultModalContent = document.getElementById('result-modal-content');
        resultModalContent.innerHTML = `<h3>Error</h3><p>An error occurred while calculating your score. Please try again.</p>`;
    }

    // Optionally, you can add the score to the modal content
    const resultModalContent = document.getElementById('result-modal-content');
    resultModalContent.innerHTML = `<h3>Your Score: ${score}%</h3><p>Based on your assessment, this is your performance. Check details in the chart below.</p>`;
} else {
    console.error('No form responses found.');
    const resultModalContent = document.getElementById('result-modal-content');
    resultModalContent.innerHTML = `<h3>Error</h3><p>It seems we couldn't find your form responses. Please try again or refresh the page.</p>`;
}
