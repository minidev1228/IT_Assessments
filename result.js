// Function to calculate total score based on form responses
function calculateScore(formResponses) {
    let totalScore = 0;
    const totalQuestions = Object.keys(formResponses).length; // Total number of questions
    const maxPossibleScore = totalQuestions * 10; // Each question's "Yes" is worth 10 points
    let c = 0;
    // Loop through each response and calculate the score
    Object.values(formResponses).forEach(response => {
        if (typeof response === 'string' && response.trim() === '') {
            // Skip empty responses
            return;
        } else if (response === 'Yes') {
            c++;
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

    console.log(totalScore, maxPossibleScore, c);

    const scorePercentage = (totalScore / maxPossibleScore) * 100; // Calculate the percentage
    return Math.round(scorePercentage); // Round to nearest integer for cleaner display
}

// Function to render the gauge chart using ZingChart
function renderGaugeChart(score) {
    console.log("rendr function is working well!");

    var myConfig = {
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
                text: '%v', //default
                fontSize: 35,
                rules: [
                    {
                        rule: '%v >= 700',
                        text: '%v<br>EXCELLENT'
                    },
                    {
                        rule: '%v < 700 && %v > 640',
                        text: '%v<br>Good'
                    },
                    {
                        rule: '%v < 640 && %v > 580',
                        text: '%v<br>Fair'
                    },
                    {
                        rule: '%v <  580',
                        text: '%v<br>Bad'
                    }
                ]
            }
        },
        tooltip: {
            borderRadius: 5
        },
        scaleR: {
            aperture: 180,
            minValue: 300,
            maxValue: 850,
            step: 50,
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
            labels: ['300', '', '', '', '', '', '580', '640', '700', '750', '', '850'],
            ring: {
                size: 50,
                rules: [
                    {
                        rule: '%v <= 580',
                        backgroundColor: '#E53935'
                    },
                    {
                        rule: '%v > 580 && %v < 640',
                        backgroundColor: '#EF5350'
                    },
                    {
                        rule: '%v >= 640 && %v < 700',
                        backgroundColor: '#FFA726'
                    },
                    {
                        rule: '%v >= 700',
                        backgroundColor: '#29B6F6'
                    }
                ]
            }
        },
        refresh: {
            type: "feed",
            transport: "js",
            url: "feed()",
            interval: 1500,
            resetTimeout: 1000
        },
        series: [
            {
                values: [score], // starting value
                backgroundColor: 'black',
                indicator: [10, 10, 10, 10, 0.75],
                animation: {
                    effect: 2,
                    method: 1,
                    sequence: 4,
                    speed: 900
                },
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
        // renderGaugeChart(score);
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
