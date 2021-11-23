var elementNow;
var elementTr;
var elementTime;
var elementPm;
var elementAudio;

var isUP = false;
var lastHundredthSecond = 100;
var stopped = false;
var lastClick = 0;
var isSound = false;
var trd;
var params = new URL(window.location.href).searchParams;

function updateTime(timestamp) {
    var nowd = new Date();
    elementNow.innerText = formatDate(nowd);
    var difference = trd - nowd;
    if (difference < 0) {
        if (!isUP) {
            document.getElementById("up").classList.add("text_enable");
            document.getElementById("down").classList.remove("text_enable");
            document.getElementById("time").classList.add("color_down");
            elementPm.innerText = "+";
            isUP = true;
        }
        if (isSound && difference > -3000) {
            if (lastHundredthSecond >= difference && lastHundredthSecond - 100 >= difference) {
                elementAudio.play();
                lastHundredthSecond = difference;
            } else if (lastHundredthSecond - 50 >= difference) {
                elementAudio.pause();
                elementAudio.currentTime = 0;
            }
        }
        difference *= -1;
    }
    var hour = Math.floor(difference / 3600000);
    if (isNaN(trd.getTime())) {
        elementTime.innerText = "er:ro:re:rr"
    } else if (hour >= 100) {
        elementTime.innerText = "ov:er:fl:ow"
    } else {
        var temp = difference - hour * 3600000;
        var minute = Math.floor(temp / 60000);
        temp -= minute * 60000;
        var second = Math.floor(temp / 1000);
        temp -= second * 1000;
        var hundredthSecond = Math.floor(temp / 10);
        elementTime.innerText = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}:${hundredthSecond.toString().padStart(2, '0')}`;
    }
    if (!stopped)
        window.requestAnimationFrame(updateTime);
}

function onLoad() {
    elementNow = document.getElementById("time_now");
    elementTr = document.getElementById("time_tr");
    elementTime = document.getElementById("time");
    elementPm = document.getElementById("pm");
    elementAudio = document.getElementById("audio");
    document.getElementById("box").addEventListener('click', event => {
        if (!isSound) {
            document.getElementById("audio").muted = false;
            console.log("Sound:ON");
            isSound = true;
        }
    });
    document.getElementById("setting").addEventListener('click', event => {
        document.getElementById("w_setting").classList.remove("hide");
    });
    const stop = document.getElementById("stop");
    stop.addEventListener('click', event => {
        if (new Date() - lastClick >= 500)
            if (!stopped) {
                stop.innerText = "START";
                stopped = true;
                lastClick = new Date();
                console.log("STOP");
            } else {
                stop.innerText = "STOP";
                stopped = false;
                window.requestAnimationFrame(updateTime);
                lastClick = new Date();
                console.log("START");
            }
    });
    if (params.get("target") == null) {
        trd = new Date(new Date().getTime() + 18000000);
        history.replaceState('', '', "?target=" + trd.getTime().toString());
    }
    else
        trd = new Date(parseInt(params.get("target")));
    elementTr.innerText = isNaN(trd.getTime()) ? "0/0/0000 - 00:00:00" : formatDate(trd);
    setAirframeLink();
    window.requestAnimationFrame(updateTime);
}

function clickSubmitSetting() {
    trd = new Date(document.getElementById("trDate").value + " " + document.getElementById("trTime").value);
    document.getElementById("trDate").value = "";
    document.getElementById("trTime").value = "";
    history.replaceState('', '', "?target=" + trd.getTime().toString());
    setAirframeLink();
    isUP = false;
    lastHundredthSecond = 100;
    document.getElementById("up").classList.remove("text_enable");
    document.getElementById("down").classList.add("text_enable");
    document.getElementById("time").classList.remove("color_down");
    elementPm.innerText = "−";
    document.getElementById("w_setting").classList.add("hide");
}

function settingCancel() {
    document.getElementById("w_setting").classList.add("hide");
}

function formatDate(date) {
    if (String(date.getMonth() + 1).length + String(date.getDate()).length == 4) {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}-${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            .replace(/\n|\r/g, '');
    } else {
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()} - ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`
            .replace(/\n|\r/g, '');
    }
}

function getDir(place, n) {
    return place.pathname.replace(new RegExp("(?:\\\/+[^\\\/]*){0," + ((n || 0) + 1) + "}$"), "/");
}

function setAirframeLink(){
    const local = window.location;
    const url = local.origin;
    const link = url + getDir(local) + "airframe.html?target=" + trd.getTime().toString();
    document.getElementById("frameUrl").value = link;
    document.getElementById("frameLink").href = link;
}