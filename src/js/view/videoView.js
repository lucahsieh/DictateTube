
let stopThisPart;

export const playVideo = (video, subList, subNo = 0) => {

    if(stopThisPart) clearTimeout(stopThisPart);


    const start = subList[subNo].start;
    const dur = subList[subNo].dur;

    console.log(subList,subNo, start,dur);
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
    return dur;
};

export const playVideoForFisrtTime = (video, subList, subNo = 0) => {

    if(stopThisPart) clearTimeout(stopThisPart);


    const start = subList[subNo].start * 1000;
    const dur = subList[subNo].dur + start;

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

export const playTillNextPartEnds = (video, subList, subNo = 0) => {

    if(stopThisPart) clearTimeout(stopThisPart);


    const start = subList[subNo].start;
    const dur1 = subList[subNo].dur;
    const dur2 = subList[subNo + 1].dur;

    video.player1.seekTo(start, true);
    video.player2.seekTo(start, true);
    video.player1.playVideo();
    video.player2.playVideo();

    return dur1;
};

export const playTillEnds = (video, subList, subNo = 0) => {

    if(stopThisPart) clearTimeout(stopThisPart);

    const start = subList[subNo].start;

    video.player1.seekTo(start, true);
    video.player2.seekTo(start, true);
    video.player1.playVideo();
    video.player2.playVideo();
};