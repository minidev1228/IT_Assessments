// Function to calculate total score based on form responses
function calculateScore(formResponses) {
    let totalScore = 0;
    const totalQuestions = Object.keys(formResponses).length; // Total number of questions
    const maxPossibleScore = totalQuestions * 10; // Each question's "Yes" is worth 10 points

    // Loop through each response and calculate the score
    Object.values(formResponses).forEach(response => {
        if (typeof response === 'string' && response.trim() === '') {
            // Skip empty responses
            return;
        }

        if (response === 'Yes') {
            totalScore += 10; // Full points for "Yes"
        } else if (response === 'No') {
            totalScore += 0;  // No points for "No"
        } else if (response === 'Unsure') {
            totalScore += 5;  // Partial points for "Unsure"
        } else if (Array.isArray(response)) {
            // For multiple-choice (assuming multiselect fields are arrays)
            const yesCount = response.filter(item => item === 'Yes').length;
            totalScore += yesCount > 0 ? 10 : 0; // You can adjust this logic to handle partial selections
        } else {
            console.warn('Unexpected response type: ', response);
        }
    });

    // Prevent division by zero
    if (maxPossibleScore === 0) {
        console.warn('No questions available for scoring.');
        return 0;
    }

    const scorePercentage = (totalScore / maxPossibleScore) * 100; // Calculate the percentage
    return Math.round(scorePercentage); // Round to nearest integer for cleaner display
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
                text: '%v', // Default
                fontSize: 35,
                rules: [
                    {
                        rule: '%v >= 80',
                        text: '%v<br>EXCELLENT'
                    },
                    {
                        rule: '%v < 80 && %v >= 60',
                        text: '%v<br>Good'
                    },
                    {
                        rule: '%v < 60 && %v >= 40',
                        text: '%v<br>Fair'
                    },
                    {
                        rule: '%v < 40',
                        text: '%v<br>Poor'
                    }
                ]
            }
        },
        scaleR: {
            aperture: 180,
            minValue: 0,
            maxValue: 100,
            step: 10,
            center: {
                visible: false
            },
            tick: {
                visible: false
            },
            item: {
                offsetR: 0,
                rules: [
                    {
                        rule: '%i == 9',
                        offsetX: 15
                    }
                ]
            },
            labels: ['0', '', '', '', '', '', '40', '60', '80', '100'],
            ring: {
                size: 50,
                rules: [
                    {
                        rule: '%v <= 40',
                        backgroundColor: '#E53935' // Poor
                    },
                    {
                        rule: '%v > 40 && %v < 60',
                        backgroundColor: '#FFA726' // Fair
                    },
                    {
                        rule: '%v >= 60 && %v < 80',
                        backgroundColor: '#29B6F6' // Good
                    },
                    {
                        rule: '%v >= 80',
                        backgroundColor: '#66BB6A' // Excellent
                    }
                ]
            }
        },
        series: [
            {
                values: [score], // Starting value
                backgroundColor: 'black',
                indicator: [10, 10, 10, 10, 0.75],
                animation: {
                    effect: 2,
                    method: 1,
                    sequence: 4,
                    speed: 900
                }
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

// Fetch form responses from localStorage
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
