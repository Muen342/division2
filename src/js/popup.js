const alarmClock = {
    onHandler : function(e) {
        chrome.alarms.create("myAlarm", {delayInMinutes: 0.1, periodInMinutes: 20} );
        window.close();
    },
    offHandler : function(e) {
        chrome.alarms.clear("myAlarm");
        window.close();
    },
    setup: function() {
        var a = document.getElementById('alarmOn');
        a.addEventListener('click',  alarmClock.onHandler );
        var a = document.getElementById('alarmOff');
        a.addEventListener('click',  alarmClock.offHandler );
    }
};

document.addEventListener('DOMContentLoaded', function () {
    // Set value of checkbox
    chrome.storage.sync.get(['activities'], function (result) {
        const activityCheckboxValues = {
            'close-eyes': true,
            'stretch': true,
            ...result.activities
        };
        console.log(activityCheckboxValues);
        Object.entries(activityCheckboxValues).forEach(([activityName, isActivityActive]) => {
            try {
                const activityRadioButton = document.getElementById(`activity-${activityName}`);
                activityRadioButton.checked = isActivityActive;
                activityRadioButton.addEventListener('change', function (e) {
                    chrome.storage.sync.get(['activities'], function (result) {
                        chrome.storage.sync.set(
                            { activities: { ...result.activities, [e.target.value]: e.target.checked }}
                        );
                    });
                });
            } catch (e) {
                console.error(e);
            }
        });
    });
    
    // Set up alarm
    alarmClock.setup();
});
