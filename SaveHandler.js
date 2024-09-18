// const CLIENT_ID = ''; // Replace with your client ID
// const API_KEY = ''; // Replace with your API Key
// const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
// const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// function handleClientLoad() {
//     gapi.load("client:auth2", initClient);
// }

// function initClient() {
//     gapi.client.init({
//         apiKey: API_KEY,
//         clientId: CLIENT_ID,
//         discoveryDocs: DISCOVERY_DOCS,
//         scope: SCOPES
//     }).then(() => {
//         addData();
//     }, (error) => {
//         console.error(JSON.stringify(error, null, 2));
//     });
// }

// function addData() {
//     const spreadsheetId = '19R2XiKl-Bo0O7w_-X1FRvby61kqlqC7quC6ZBskGQaA'; // Replace with your spreadsheet ID
//     const range = 'Sheet1!A:J'; // Specify the range where you want to add data
//     const values = [
//         ["Data 1", "Data 2"]  // Replace with your actual data
//     ];

//     const body = {
//         values: values
//     };

//     gapi.client.sheets.spreadsheets.values.append({
//         spreadsheetId: spreadsheetId,
//         range: range,
//         valueInputOption: "RAW",
//         resource: body
//     }).then((response) => {
//         const result = response.result;
//         console.log(`${result.updates.updatedCells} cells updated.`);
//     }, (error) => {
//         console.error('Error:', error);
//     });
// }

// // Load the API client and auth2 library
// handleClientLoad();
const CLIENT_ID = '855795728925-dursk7kambmj73am0hfti1mssm8np97m.apps.googleusercontent.com'; // Replace with your client ID
const API_KEY = 'AIzaSyCZSTD40hZzNIm9PUrQXdAXzHI2HSL1zyI'; // Replace with your API key
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: DISCOVERY_DOCS,
    scope: SCOPES
    }).then(() => {
    gapi.auth2.getAuthInstance().signIn().then(() => {
        appendData(['John Doe', 'Boy', 43]);
    });
    });
}

function appendData(values) {
    const SHEET_ID = '19R2XiKl-Bo0O7w_-X1FRvby61kqlqC7quC6ZBskGQaA'; // Replace with your Google Sheet ID
    const RANGE = 'Sheet1!A:J'; // Adjust the range as needed

    const params = {
    spreadsheetId: SHEET_ID,
    range: RANGE,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    };

    const valueRangeBody = {
    "range": RANGE,
    "values": [values],
    };

    gapi.client.sheets.spreadsheets.values.append(params, valueRangeBody).then((response) => {
    console.log(`${response.result.updates.updatedCells} cells appended.`);
    }, (error) => {
    console.error('Error appending data:', error);
    });
}

handleClientLoad()