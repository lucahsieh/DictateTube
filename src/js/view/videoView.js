
let stopThisPart;

export const playVideo = (video, subList, subNo = 0) => {

    if(stopThisPart) clearTimeout(stopThisPart);


    const start = subList[subNo].start;
    const dur = subList[subNo].dur;

    console.log(state.video.player1);
    video.player1.seekTo(start, true);
    video.player2.seekTo(start, true);
    video.player1.playVideo();
    video.player2.playVideo();

    if(subNo < subList.length - 1) {
        stopThisPart = setTimeout(() => {
            video.player1.pauseVideo();
            video.player2.pauseVideo();
        }, dur);
    }
};