let abr_logs = {}

chrome.runtime.sendMessage({action: 'get_logs'}, function (response) {

    abr_logs = response.data

    let logs = document.getElementById('logs')

    if (Object.keys(abr_logs).length === 0) {
        alert('wwwww')
        logs.style.display = 'none'
        return
    } else {

        for (const [key, log] of Object.entries(abr_logs)) {
            let option = document.createElement('option')
            option.text = log['title']
            logs.add(option)
        }
    }

});
