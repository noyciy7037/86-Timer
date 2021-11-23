var elementTime;
var elementPm;

var isUP = false;
var trd;
var params = new URL(window.location.href).searchParams;

function updateTime(timestamp) {
    var nowd = new Date();
    var difference = trd - nowd;
    if (difference < 0) {
        if (!isUP) {
            elementPm.innerText = "+";
            isUP = true;
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
    window.requestAnimationFrame(updateTime);
}

function onLoad() {
    elementTime = document.getElementById("time");
    elementPm = document.getElementById("pm");
    if (params.get("target") == null)
        trd = new Date(new Date().getTime() + 18000000);
    else
        trd = new Date(parseInt(params.get("target")));
    window.requestAnimationFrame(updateTime);
}