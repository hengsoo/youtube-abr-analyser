let abr_logs = {}


chrome.tabs.onCreated.addListener((tab) => {
        if (tab.url.includes("https://www.youtube.com/watch?v=")) {
            abr_logs[tab.id] = {}
            abr_logs[tab.id]['header'] = 'datetime,itag,clen,buffer_health'
            abr_logs[tab.id]['data'] = []
            abr_logs[tab.id]['title'] = tab.title
            console.log(`Added ABR log for \n ${tab.id} - ${tab.title}`)
            console.log(abr_logs)
        }
    }
)

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        // Save logs
        if (request.action === 'get_logs'){
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

        chrome.tabs.get(details.tabId, (tab) => {
            console.log(`Measuring ABR on \n ${tab.title}`)

            chrome.tabs.sendMessage(tab.id, {action: "get_buffer_health"},
                function (response) {
                    if (response === undefined) {
                        if (chrome.runtime.lastError) {
                            console.warn(`Can't get video's buffer health. Reload ${tab.title} maybe?`)
                        }
                    } else {
                        let log_data = `${Date.now()},${itag},${clen},${response.buffer_health}`
                        abr_logs[tab.id]['data'].push(log_data)
                    }
                })
        })

    },
    {urls: ["*://*.googlevideo.com/videoplayback?*"]}
);
