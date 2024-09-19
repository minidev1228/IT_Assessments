async function handleDownload() {
    const content = document.createElement('div');
    content.classList.add("container");
    let htmlContent = '';
    let now = new Date();
    htmlContent = `${htmlContent} <div class="cover">
    <h1>IT Assessment Report</h1>
    <div class="info-block">
        <p>Name: ${results[results.length - 1][1]}</p>
        <p>Email: ${results[results.length - 1][4]}</p>
        <p>Phone: ${results[results.length - 1][7]}</p>
        <p>Generated On: ${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}, ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}</p>
    </div>
    </div> <div class="page-break"></div><div class="score-section">
    Score: ${myScore}%
    </div><br />`
    let idd = 1;
    results.forEach((result, id) => {
        if(id === results.length - 1 || id%2 === 0) return; 
        else {
            result.forEach((item, id)=>{
                if(id%3 === 0) htmlContent = `${htmlContent} <div class="section">
                <h2><span class="icon">${idd}</span>${item.split(".")[1]}</h2>`;
                else if(id%3 === 1){
                        htmlContent = `${htmlContent} <p>Answer: ${item}</p>
                    </div>`
                    idd++;
                };
            })
        }
    })
    htmlContent = `${htmlContent} <br /> <div class="closing-page">
        <h2>Thank You for Completing the IT Assessment!</h2>
    </div><footer>
    &copy; 2024 IT Assessment Report | Powered by CMIT Solutions
    </footer>`
    content.innerHTML = htmlContent;
    const filename = 'result.pdf';
    try {
        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            jsPDF: {
                format: 'letter',
                orientation: 'portrait',
                putTotalPages: true 
            }
        };
        await html2pdf().set(opt).from(content).save();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

const downloadButton = document.getElementById("download_button");

downloadButton.addEventListener('click', () => {
    handleDownload();
})