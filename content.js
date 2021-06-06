function main() {
    console.log(`
        =====================================
        ==        ABR Traffic Analyser     ==
        =====================================
    `)

    let [video_player] = document.getElementsByTagName('video')

    if (video_player === undefined) {
        console.log('ABR Traffic Analyser - No video player found')
        return true
    }

    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            if (request.action === 'get_video_info')
                sendResponse({
                    buffer_health: video_player.buffered.end(0) - video_player.buffered.start(0),
                    view_width: video_player.style.width,
                    view_height: video_player.style.height,
                })
        }
    )

}

main()
