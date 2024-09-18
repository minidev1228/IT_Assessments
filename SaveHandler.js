const CLIENT_ID = '150297208483-916ueua8cqclorl5c54um6rbrai5mhpp.apps.googleusercontent.com'; // Replace with your client ID
const API_KEY = 'AIzaSyC8mXpWdYPlFm9gNXzQRvtPyEKK3KW23Pg'; // Replace with your API Key
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        addData();



        
    }, (error) => {
        console.error(JSON.stringify(error, null, 2));
    });
}

function addData() {
    const spreadsheetId = '19R2XiKl-Bo0O7w_-X1FRvby61kqlqC7quC6ZBskGQaA'; // Replace with your spreadsheet ID
    const range = 'Sheet1!A:J'; // Specify the range where you want to add data
    const values = [
        ["Data 1", "Data 2"]  // Replace with your actual data
    ];

    const body = {
        values: values
    };

    gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: spreadsheetId,
        range: range,
        valueInputOption: "RAW",
        resource: body
    }).then((response) => {
        const result = response.result;
        console.log(`${result.updates.updatedCells} cells updated.`);
    }, (error) => {
        console.error('Error:', error);
    });
}

// Load the API client and auth2 library
handleClientLoad();