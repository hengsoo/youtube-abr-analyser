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
            option.value = key
            logs.add(option)
        }
    }

});

document.getElementById('download_log').addEventListener("click", download_csv)

function download_csv() {

    let log_key = document.getElementById('logs').value

    let csv = abr_logs[log_key]['header'] + '\n';
    abr_logs[log_key]['data'].forEach(function (row) {
        csv += row + '\n';
    });

    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = `ABR-LOG-${abr_logs[log_key]['title']}.csv`;
    hiddenElement.click();
}
