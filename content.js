function main() {
    console.log(`
        =====================================
        ==        ABR Traffic Analyser     ==
        =====================================
    `)

    let [video_player] = document.getElementsByTagName("video")

    if (video_player === undefined) {
        console.log("No video player found")
        return true
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action === "get_buffer_health")
                sendResponse({
                    buffer_health: video_player.buffered.end(0) - video_player.buffered.start(0)
                })
        }
    )

}

main()
