const dateDoc = document.getElementById('date');
const timeDoc = document.getElementById('time');

function convert(string){
  return string.toString().padStart(2,0);
}


function dateTime() {
    const dateTime = new Date();

    let day = dateTime.getDate();
    let month = dateTime.getMonth();
    let year = dateTime.getFullYear();
    let hour = dateTime.getHours();
    let min = dateTime.getMinutes();
    let sec = dateTime.getSeconds();

    const monthArr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let monthName = monthArr[month];

    let dateNow = convert(day) + "-" + monthName + "-" + year;

    let timeNow = " ";

    if (hour <= 12){
        timeNow = convert(hour) + ":" + convert(min) + ":" + convert(sec) + " AM"
    } else if(hour > 12){
        timeNow = hour - 12;
        timeNow = convert(timeNow) + ":" + convert(min) + ":" + convert(sec) + " PM"
    }

    dateDoc.innerHTML = dateNow;
    timeDoc.innerHTML = timeNow;
}

dateTime();

setInterval(function () {
    dateTime();
}, 1000)
