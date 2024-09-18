
const CLIENT_ID = '855795728925-dursk7kambmj73am0hfti1mssm8np97m.apps.googleusercontent.com'; // Replace with your client ID
const API_KEY = 'AIzaSyCZSTD40hZzNIm9PUrQXdAXzHI2HSL1zyI'; // Replace with your API key
const DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";
const SHEET_ID = '19R2XiKl-Bo0O7w_-X1FRvby61kqlqC7quC6ZBskGQaA'; // Replace with your Google Sheet ID
const RANGE = 'Sheet1!A:J'; // Adjust the range as needed

function init() {
    gapi.client.setApiKey(CLIENT_ID);
    gapi.client.load('sheets', 'v4', function() {
        // Authentication is complete
    });
}

function addData() {
    var spreadsheetId = SHEET_ID;
    var range = RANGE; // Replace with the range where you want to add data
    var values = [['New Data', 'Added using JavaScript']];

    gapi.client.sheets.spreadsheets.values.append({
        'spreadsheetId': spreadsheetId,
        'range': range,
        'resource': {
        'values': values
        }
    }, function(err, response) {
        if (err) {
        console.error(err);
        } else {
        console.log(response);
        }
    });
}

addData();