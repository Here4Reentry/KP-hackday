var ACCOUNT_SID = 'ACe98da37767c081d539e31bfcf2967792';
var ACCOUNT_TOKEN = 'a7f76ce7bacbf5382ac0cee454a8aee2';

//This is a spreadsheet bound script that is also deployed as a web app

//Inbound execution kicks off and Sends caller through welcome tree
//Inbound script kicks this off
function readRows() {
 
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[0];
  Logger.log(sheet.getSheetId());
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();
  Logger.log(sheet)

  for (var i = 1; i <= 1/*numRows - 1*/; i++) {
    makePhoneCall(values[i][0],values[i][1],values[i][2]);
  }
}

function makePhoneCall(name,number, message){
  //URL callback to the service with the message
  var url = ScriptApp.getService().getUrl() + '?MSG'+message.replace(/ /g,'+'); //can't seem to send = in here
  Logger.log(url);
  var payload = {
    "From" : "+17348905664"
    ,"To" : '+' + number
    ,"Url": url
    ,"Method" : "GET"
  };
  
  var headers = {
    "Authorization" : "Basic " + Utilities.base64Encode(ACCOUNT_SID + ':' + ACCOUNT_TOKEN)
  };
  

  
  var options =
      {
        "method" : "post",
        "payload" : payload,
        "headers" : headers
      };
  Logger.log("calling " + name + " at " + number + " with messsage - " + message);           
  var url = 'https://api.twilio.com/2010-04-01/Accounts/'+ACCOUNT_SID+'/Calls.json';
  var response = UrlFetchApp.fetch(url, options);
  //Logger.log(response.getResponseCode());
  //Logger.log(response.getContentText());
}




//entry point to the Twillio call back
function doGet(args){
  var msg = '';
  for (var p in args.parameters) {
    //there are many incoming query params. lets find ours starting with a MSG
    if(p.indexOf('MSG') > -1){
      msg += p.replace('MSG','');
      break;
    }
    // there HAS to tbe a better way to get the entire query string!
  }
  
  var t = HtmlService.createTemplateFromFile(".html");
  t.msg = msg;
  var content = t.evaluate().getContent();
  return ContentService.createTextOutput(content).setMimeType(ContentService.MimeType.XML);
}