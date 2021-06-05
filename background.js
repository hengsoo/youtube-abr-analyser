abr_logs = {}


chrome.webRequest.onBeforeRequest.addListener(
    function (details) {

        console.log(details)
        const url = details.url

        const url_params = new URLSearchParams(url.substring(url.indexOf('?')))

        const clen = url_params.get('clen')
        const itag = url_params.get('itag')

        chrome.tabs.get( details.tabId, (tab)=>{
            console.log(`Measuring ABR on ${tab.title}`)

            chrome.tabs.sendMessage(tab.id, {action: "get_buffer_health"},
                function (response) {
                    if (response === undefined) {
                        if (chrome.runtime.lastError){
                            console.warn(`Reload ${tab.title} maybe?`)
                        }
                    } else{
                        chrome.storage.local.set()
                        console.log(`${Date.now()}\t${itag}\t${clen}\t${response.buffer_health}`)
                    }
                })
        })

    },
    {urls: ["*://*.googlevideo.com/videoplayback?*"]}
);
