// create the XMLHttpRequest object, according browser
function get_XmlHttp() {  // create the variable that will contain the instance of the XMLHttpRequest object (initially with null value)
  var xmlHttp = null;
  if (window.XMLHttpRequest) {		// for Forefox, IE7+, Opera, Safari, ...
    xmlHttp = new XMLHttpRequest();
  } else if(window.ActiveXObject) {	// for Internet Explorer 5 or 6
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  return xmlHttp;
}

function getTimeRangeInformation(form, method, tagID) {  //House Win/Loss Over Time Period
  var start = form.elements["start"].value;
  var end = form.elements["end"].value;
  if (start != "" && end != "") { 
    var request = get_XmlHttp();
    var data = 'method=' + method + '&start=' + start + '&end=' + end;
    request.open("POST", 'classes/Handler.php', true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.send(data);
    request.onreadystatechange = function() {
      if (request.readyState == 4) {
        if (method == "getsiteactivity") {
          document.getElementById(tagID).innerHTML = request.responseText;
        } else if (method == "gethouseprofit") {
          document.getElementById(tagID).innerHTML = request.responseText;
        } else if (method == "getuseractivity") {
          document.getElementById(tagID).innerHTML = request.responseText;
        }
      }
    }
  } else {
    document.getElementById(tagID).innerHTML = "Error - Please fill out all values";
  }
}