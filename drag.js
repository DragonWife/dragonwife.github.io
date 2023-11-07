//Make the DIV element draggagle:
dragElement(document.getElementById("lastfm"));
dragElement(document.getElementById("koa-ad"));
dragElement(document.getElementById("snorkle-square"));
dragElement(document.getElementById("linkbox"));
dragElement(document.getElementById("maintext"));

function dragElement(id) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  id.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    id.style.top = (id.offsetTop - pos2) + "px";
    id.style.left = (id.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// get your own last.fm api key from https://www.last.fm/api/account/create
const LASTFM_API_KEY = "d93ae0e0a08e683aa7f89fae90249dc0"
const username = "Dragoowife" // change username here
const url = "https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&format=json&api_key=" + LASTFM_API_KEY + "&limit=1&user=" + username

// make API call
function httpGet(url) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", url, false);
	xmlHttp.send(null);
	return xmlHttp.responseText;
}

// converts unix time to relative time text (eg. 2 hours ago)
function relativeTime(time, time_text) {
    var time_now = Math.round(Date.now() / 1000)
    var time_diff = time_now - time

    let SEC_IN_MIN = 60
    let SEC_IN_HOUR = SEC_IN_MIN * 60
    let SEC_IN_DAY = SEC_IN_HOUR * 24

    if (time_diff < SEC_IN_HOUR) {
        let minutes = Math.round(time_diff / SEC_IN_MIN)
        return minutes + " minute" +
            ((minutes != 1) ? "s" : "") + " ago"
    }
    if (time_diff >= SEC_IN_HOUR && time_diff < SEC_IN_DAY) {
        let hours = Math.round(time_diff / SEC_IN_HOUR)
        return hours + " hour" +
            ((hours != 1) ? "s" : "") + " ago"
    }
    if (time_diff >= SEC_IN_DAY)
        return time_text
}

var json = JSON.parse(httpGet(url));
var last_track = json.recenttracks.track[0]
var track = last_track.name
var trackLink = last_track.url
var artist = last_track.artist['#text']
let relative_time = null
if (last_track.date) {
    var unix_date = last_track.date.uts
    var date_text = last_track.date["#text"]
    relative_time = relativeTime(unix_date, date_text)
}
var now_playing = (last_track["@attr"] == undefined) ? false : true
var imageLink = last_track.image[1]["#text"]

trackElem = document.getElementById('track')
artistElem = document.getElementById('artist')
dateElem = document.getElementById('date')
nowplayingElem = document.getElementById('now-playing')
albumcoverElem = document.getElementById('album-cover')

trackLinkElem = document.createElement('a')
trackLinkElem.id = "track"
trackLinkElem.href = trackLink
trackLinkElem.target = "_blank"
trackLinkElem.textContent = track

userLinkElem = document.createElement('a')
userLinkElem.href = "https://www.last.fm/user/" + username
userLinkElem.target = "_blank"
userLinkElem.textContent = (relative_time != null) ? relative_time : "Now playing..."

trackElem.appendChild(trackLinkElem)
artistElem.textContent = artist
dateElem.appendChild(userLinkElem)
albumcoverElem.src = imageLink

console.log(
    "Artist: " + artist + "\n" +
    "Track: " + track + "\n" +
    "Date: " + relative_time + "\n" +
    "Now playing: " + now_playing)
