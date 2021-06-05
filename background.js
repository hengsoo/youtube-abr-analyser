let abr_logs = {}


chrome.tabs.onUpdated.addListener((tab_id, change_info, tab) => {

    if ('url' in tab && (change_info['status'] === 'complete' || 'title' in change_info)) {

        if (tab.url.includes("https://www.youtube.com/watch")) {
            chrome.scripting.executeScript({
                    target: {tabId: tab.id, allFrames: true},
                    files: ['content.js'],
                }
            ).then()
            // If log exists
            if (tab_id.toString() in abr_logs) {
                // If url has changed (clicked on other video link) , update log info
                if (tabUrlChanged(tab) === true) {
                    updateTabAbrLogInfo(tab)
                }
                // Update title if necessary
                if ('title' in change_info) {
                    abr_logs[tab_id]['title'] = change_info['title']
                }
            }
            // Create new log if log doesn't exist
            else {
                abr_logs[tab.id] = {}
                abr_logs[tab.id]['header'] = 'datetime,itag,clen,buffer_health'
                abr_logs[tab.id]['data'] = []
                abr_logs[tab.id]['title'] = tab.title
                abr_logs[tab.id]['url'] = tab.url
                console.log(`Added ABR log for \n ${tab.id} - ${tab.title}`)
            }
        }
    }

})

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        // Save logs
        if (request.action === 'get_logs') {
            console.log('sending logs')
            console.log(abr_logs)
            sendResponse({data: abr_logs});
        }
    }
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {

        const url = details.url

        const url_params = new URLSearchParams(url.substring(url.indexOf('?')))

        const clen = url_params.get('clen')
        const itag = url_params.get('itag')
        let buffer_health = 0

        chrome.tabs.get(details.tabId, (tab) => {
            console.log(`Measuring ABR on \n ${tab.title}`)

            chrome.tabs.sendMessage(tab.id, {action: "get_buffer_health"},
                function (response) {

                    // Set buffer health value
                    if (response === undefined) {
                        if (chrome.runtime.lastError) {
                            // console.warn(chrome.runtime.lastError.message)
                            console.warn(`Can't get video's buffer health.`)
                        }
                    } else {
                        buffer_health = response.buffer_health
                    }

                    // Append log data
                    let log_data = `${Date.now()},${itag},${clen},${buffer_health}`
                    abr_logs[tab.id]['data'].push(log_data)
                    console.log(log_data)
                })
        })

    },
    {urls: ["*://*.googlevideo.com/videoplayback?*"]}
);

function tabUrlChanged(tab) {
    return tab.url === abr_logs[tab.id]['url'];
}

function updateTabAbrLogInfo(tab) {
    abr_logs[tab.id]['url'] = tab.url
    abr_logs[tab.id]['title'] = tab.title
}


