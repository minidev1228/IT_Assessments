
// Function to upload PDF to the dedicated folder and get a public URL
async function uploadPDFToFolder(pdfBlob, fileName) {
    async function uploadToDrive(pdfBlob, fileName) {
        // This is a placeholder function. Replace it with your actual logic.
        // For now, this will simulate a successful upload.
        const mockUploadUrl = `https://cmitdigital.com/ac/Liveform/new7/results/${fileName}`;
        console.log('Mock upload successful. URL:', mockUploadUrl); // Debug log
        return mockUploadUrl;
    }

    try {
        const publicUrl = await uploadToDrive(pdfBlob, fileName);
        console.log('Public URL returned:', publicUrl); // Debug log
        return publicUrl;
    } catch (error) {
        console.error('Error uploading PDF:', error);
        return null;
    }
}

// Function to send data to webhook
async function sendDataToWebhook(data) {
    const webhookUrl = 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjYwNTZkMDYzMjA0MzA1MjZhNTUzZDUxMzAi_pc'; // Replace with your actual webhook URL

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            console.log('Data sent to webhook successfully!'); // Debug log
        } else {
            console.error('Failed to send data to webhook:', response.statusText);
        }
    } catch (error) {
        console.error('Error sending data to webhook:', error);
    }
}

// Main function to handle the entire process
async function handleWebhookAndPDF() {
    console.log('Start handling webhook and PDF...'); // Debug log

    const formResponses = JSON.parse(localStorage.getItem('formResponses'));

    if (!formResponses) {
        console.error('No form responses found to send to webhook.');
        return;
    }

    console.log('Form responses found:', formResponses); // Debug log

    // Generate the PDF
    const pdfBlob = await generatePDF();
    if (!pdfBlob) {
        console.error('Failed to generate PDF.');
        return;
    }
    console.log('PDF generated successfully.'); // Debug log

    // Construct the filename based on user's name and date
    const userName = formResponses['Full Name'] || 'Unknown';
    const date = new Date().toISOString().split('T')[0]; // Current date in YYYY-MM-DD format
    const fileName = ${userName}-${date}.pdf;

    // Upload the PDF and get the public URL
    const pdfUrl = await uploadPDFToFolder(pdfBlob, fileName);
    if (!pdfUrl) {
        console.error('Failed to upload PDF, cannot proceed with webhook.');
        return;
    }
    console.log('PDF uploaded successfully. URL:', pdfUrl); // Debug log

    // Prepare data for webhook
    const webhookData = {
        date: new Date().toLocaleString(),
        name: formResponses['Full Name'] || 'Unknown',
        email: formResponses['Email address'] || 'Unknown',
        phone: formResponses['Phone Number'] || 'Unknown',
        pdf_url: pdfUrl
    };

    console.log('Webhook data prepared:', webhookData); // Debug log

    // Send data to webhook
    await sendDataToWebhook(webhookData);
    console.log('Webhook handling completed.'); // Debug log
}

// Attach event listener to a button (replace 'send-webhook-btn' with your button's ID)
document.getElementById('send-webhook-btn').addEventListener('click', handleWebhookAndPDF);