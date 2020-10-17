// Check Alarm status
function checkAlarm() {
  chrome.alarms.getAll(function (alarms) {

    if (alarms.length == 1) {
      document.getElementById('currentAlarm').style.display = "block"
      document.getElementById('newAlarm').style.display = "none"
      var alarm = alarms[0]
      var alarmDescription = '<p>Alarm Name: ' + alarm.name + '<br> Scheduled on ' + new Date(alarm.scheduledTime) + ' <u><b>every ' + Math.floor(alarm.periodInMinutes/60).toString() + ' hours</b></u> </p'
      document.getElementById('currentAlarm').getElementsByTagName('p')[0].innerHTML = alarmDescription
    }
    else {
      document.getElementById('currentAlarm').style.display = "none"
      document.getElementById('newAlarm').style.display = "block"
    }
  })
}

// Capture data when creating alarm
var view = chrome.extension.getViews({ type: "popup" });

if (view.length > 0) {
  checkAlarm()

  document.getElementById('createAlarm').addEventListener('click', function () {
    chrome.alarms.create(document.getElementById('alarmName').value, {
      delayInMinutes: parseInt(document.getElementById('delayMins').value),
      periodInMinutes: parseInt(document.getElementById('repeatHrs').value*60),
    })
    checkAlarm()
  })
}

// Remove alarm
document.getElementById('removeAlarm').addEventListener('click', function () {
  chrome.alarms.clearAll()
  document.getElementById('currentAlarm').style.display = "none"
  document.getElementById('newAlarm').style.display = "block"
})
