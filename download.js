async function handleDownload() {
    const content = document.createElement('div');
    let htmlContent = '';
    results.forEach((result, id) => {
        if(id%2 === 0) htmlContent = `${htmlContent} <h3>${result[0]}</h3>`;
        else {
            result.forEach((item, id)=>{
                if(id%3 === 0) htmlContent = `${htmlContent} <h5>${item}</h5>`;
                else if(id%3 === 1) htmlContent = `${htmlContent} <h6>${item}</h6>`;
            })
        }
    })
    htmlContent = `${htmlContent} ${createGaugeChart(myScore)}`;
    htmlContent = `${htmlContent} <h3>${finalResult[0]}</h3>`
    htmlContent = `${htmlContent} <h5>${finalResult[1]}</h5>`
    htmlContent = `${htmlContent} <hr> <h6>${finalResult[2]}</h6>`
    htmlContent = `${htmlContent} <hr> <h6>${finalResult[3]}</h6>`
    htmlContent = `${htmlContent} <hr> <h6>${finalResult[4]}</h6>`
    htmlContent = `${htmlContent} <hr> <h6>${finalResult[5]}</h6>`
    content.innerHTML = htmlContent;
    const filename = 'result.pdf';
    try {
        const opt = {
            margin: 10,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            jsPDF: {
                format: 'letter',
                orientation: 'portrait'
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