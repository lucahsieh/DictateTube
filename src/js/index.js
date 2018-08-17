import { elements, renderLoader, clearLoader} from './view/base';
import Transcript from './module/Transcript';
import Video from './module/Video';
import * as videoView from './view/videoView';
import Search from './module/Search';
import * as searchView from './view/searchView';
import Pannel from './module/Pannel';
import * as pannelView from './view/pannelView';
import Recommend from './module/Recommend';
import * as recommendView from './view/recommendView';
import firebase from 'firebase';

const state = {
};

// test
window.state = state;

window.addEventListener('load', async() => {
    setUpEnvironment();
    controlRecommend();
    pannelView.updateCenterPannel();
    controlVideo('5jSZfTcsypI');
});


const setUpEnvironment = () => {
    firebase.initializeApp({
        apiKey: "AIzaSyDuvJxuQN-pGyrKPt1Ja8ALS8hCuva49HQ",
        authDomain: "dictatetube.firebaseapp.com",
        projectId: "dictatetube"
    });
      
    // Initialize Cloud Firestore through Firebase
    state.db = firebase.firestore();


}

/**
 * RECOMMENDATION CONTROLLER
 */
const controlRecommend = async () => {
    if(!state.recommend) state.recommend = new Recommend(state.db);
    state.recommend.list = await state.recommend.getRecommendFromFirebase();
    recommendView.renderRecommended(state.recommend.list, 'recommendations');
    recommendView.showRecommend();
};

elements.recommended.addEventListener('click', async(e) => {
    const btn = e.target.closest('.recommended__btn');
    const video = e.target.closest('.recommended_item');
    if(btn) {
        // Go to the page
        const page = parseInt(btn.dataset.goto);
        recommendView.clearResult();
        recommendView.renderRecommended(state.recommend.list, 'recommendations', page);
    } else if (video) {
        state.currentVideo = state.recommend.list[parseInt(video.dataset.videoindex)];
        const hasSubList = await controlTranscript();
        if(hasSubList) {
            controlPannel();
            await controlVideo();
            pannelView.updatePlayButton();
        }
        
    }
})

/** 
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    // 1) Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearResult();
        renderLoader();

        try {
            // 4) Search for videos
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.clearInputText();
            searchView.renderSearchResult(state.search.results, 'search results');
            searchView.showSearchResult();

            // Scans and marks no subtitle items
            validateVideo();

        } catch (err) {
            clearLoader();
            alert('Something wrong with the search...');
            console.log(err);
        }
    }
    
}

elements.searchSubmit.addEventListener('click', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResult.addEventListener('click', async(e) => {
    const btn = e.target.closest('.search__btn');
    const video = e.target.closest('.result_item');
    if(btn) {
        // Go to the page
        const page = parseInt(btn.dataset.goto);
        searchView.clearResult();
        searchView.renderSearchResult(state.search.results, 'search results', page);
        validateVideo();
    } else if (video) {
        state.currentVideo = state.search.results.find((e) => e.videoID === video.dataset.videoid);
        const hasSubList = await controlTranscript();
        if(hasSubList) {
            controlPannel();
            await controlVideo();
            pannelView.updatePlayButton();
        } else {
            video.classList.replace('hasSubtitle', 'noSubtitle');
        }
    }
})

const validateVideo = () => {
    const allItems = elements.searchResult.querySelectorAll('.hasSubtitle');
    allItems.forEach( async e => {
        const hasSub = await state.search.hasSubtitleByElement(e);
        if(!hasSub) {
            e.classList.replace('hasSubtitle', 'noSubtitle');
            state.search.marksVideoWithNoSubByElement(e);
        };
    })
};



// /** 
//  * VIDEO CONTROLLER
//  */

const controlVideo = async (videoID = state.currentVideo.videoID) => {
    if ( !state.video || !state.video.player1 && !state.video.player2){
        // ifram is not loaded
        state.video = new Video();
        state.video.loadPlayer(videoID);
    } else {
        // palyer1 and player2 had been created, so update it by new id
        state.video.replaceVideo(videoID);
    }
}

/** 
 * TRANSCRIPT CONTROLLER
 */
const controlTranscript = async () => {
    let isSuccess = false;
    state.transcript = new Transcript(state.currentVideo.videoID,"en");
    try {
        // Load subtitle from database and save to state.text(array)
        state.currentVideo.subList = await state.transcript.getTranscript();
        isSuccess =  state.currentVideo.subList? true : false;

    } catch(error) {
        alert('Error: cannot load transcript!');
        console.log(error);
    };
    return isSuccess;
};

/** 
 * PANNEL CONTROLLER
 */
const controlPannel = () => {
    state.pannel = new Pannel(state.currentVideo)
    if (!state.video || !state.video.player1 && !state.video.player2) {
        pannelView.createPannel(state.pannel.subList, state.pannel.page);
        searchView.hideSearchResult();
        recommendView.hideRecommend();
        pannelView.showPannel();
        pannelView.showTranscript();
    } else {
        pannelView.updatePannel(state.pannel.subList, state.pannel.page);
        searchView.hideSearchResult();
        recommendView.hideRecommend();
        pannelView.showPannel();
        pannelView.showTranscript();
    }
    
};

// Handling Pannel Events
elements.pannelControl.addEventListener('click', (e) => {
    const subList = state.currentVideo.subList;
    const pageBut = e.target.closest('.pages');
    const nextBut = e.target.closest('.pannel__btn--next');
    const replBut = e.target.closest('.pannel__btn--repl');
    const prevBut = e.target.closest('.pannel__btn--prev');
    const playBut = e.target.closest('.playButton');
    let pageNum;

    if (pageBut) {
        pageNum = parseInt(pageBut.dataset.goto);
        updatePannelNPlayVideo(subList, pageNum);
    } else if (nextBut) {
        pageNum = parseInt(nextBut.dataset.goto);
        updatePannelNPlayVideo(subList, pageNum);
    } else if (replBut) {
        pageNum = parseInt(replBut.dataset.goto);
        updatePannelNPlayVideo(subList, pageNum);
    } else if (prevBut) {
        pageNum = parseInt(prevBut.dataset.goto);
        updatePannelNPlayVideo(subList, pageNum);
    } else if (playBut) {
        pageNum = parseInt(playBut.dataset.goto);
        videoView.playVideoForFisrtTime(state.video, subList, pageNum);
        pannelView.removePlayBut();
    }
});

const updatePannelNPlayVideo = (subList, pageNum) => {
    state.pannel.pageNum = pageNum;
    state.pannel.subList = subList;
    pannelView.updatePannel(subList, pageNum);
    videoView.playVideo(state.video, subList, pageNum);
    pannelView.removePlayBut();
    // setUpKeyBoardEvent();
}


window.addEventListener('keypress', (e) => {
    const key = e.path[0];
    if( key.dataset.subtitlepage >= 0 &&
        state.pannel.subList &&
        state.pannel.pageNum >= 0 &&
        key.dataset.subtitlepage == state.pannel.pageNum) { 
        console.log('checking');
        const pageNum = state.pannel.pageNum;
        const subList = state.pannel.subList;
    
       
        const position = state.pannel.getQuestionPosition();
        let res = state.pannel.checkAns(e.key, position);
        console.log(res);
        switch(res) {
            case('correct'):
                state.pannel.restCounter();
                state.pannel.saveAns(position);
                pannelView.updateSubtitle(subList, pageNum);
                break;
            case('wrong'):
                state.pannel.increaseCounter();
                break;
            case('pass'):
                state.pannel.restCounter();
                state.pannel.saveAns(position);
                pannelView.updateSubtitle(subList, pageNum);
                break;
            case('end'):
                videoView.playTillEnds(state.video, subList, pageNum);
                state.pannel.saveAns(position);
                pannelView.updatePannel(subList, pageNum);
                break;
            case('finish'):
                const dur = videoView.playTillNextPartEnds(state.video, subList, pageNum);
                state.pannel.saveAns(position);
                pannelView.updatePannel(subList, pageNum);
                state.pannel.goToNextPage();

                // if(state.pannel.NextPart) clearTimeout(NextPart);
                state.pannel.NextPart = setTimeout(() => {
                    pannelView.updatePannel(subList, pageNum + 1);
                }, dur);
                break;
            case('done'):
                break;

        }
    }
});