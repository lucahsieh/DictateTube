import { elements, renderLoader, clearLoader} from './view/base';
import Transcript from './module/Transcript';
import * as transcriptView from './view/transcriptView';
import Video from './module/Video';
import * as videoView from './view/videoView';
import Search from './module/Search';
import * as searchView from './view/searchView';
import Pannel from './module/Pannel';
import * as pannelView from './view/pannelView';
import Recommend from './module/Recommend';
import * as recommendView from './view/recommendView';
import firebase from 'firebase';
require("firebase/firestore");

const state = {
};

// test
window.state = state;


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
    const recommedList = await state.recommend.getRecommendFromFirebase();
    console.log(recommedList);
    state.recommedList;
}

window.addEventListener('load', async() => {
    setUpEnvironment();
    controlRecommend();
});

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
            // 4) Search for recipes
            await state.search.getResults();
    
            // 5) Render results on UI
            clearLoader();
            searchView.clearInputText();
            searchView.renderSearchResult(state.search.results, 'search results');
            searchView.showSearchResult();

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
    } else if (video) {

        searchView.hideSearchResult();

        state.videoID = video.dataset.videoid;
        console.log(state.videoID + ' blcikced video');
        await controlTranscript();
        controlPannel();
        await controlVideo();
        pannelView.updatePlayButton();
        
    }
})



// /** 
//  * VIDEO CONTROLLER
//  */

const controlVideo = async () => {
    if ( !state.video || !state.video.player1 && !state.video.player2){
        // ifram is not loaded
        console.log(state.videoID+' bereCreatVideo');
        state.video = new Video();
        state.video.loadPlayer(state.videoID);
    } else {
        // palyer1 and player2 had been created, so update it by new id
        console.log(state.videoID+' knowing had and update');
        state.video.replaceVideo(state.videoID);
    }
}

/** 
 * TRANSCRIPT CONTROLLER
 */
const controlTranscript = async () => {

    state.transcript = new Transcript(state.videoID,"en");
    try {
        // Load subtitle from database and save to state.text(array)
        await state.transcript.getTranscript();

    } catch(error) {
        alert('Error: cannot load transcript!');
        console.log(error);
    };
};





/// TEST
// window.addEventListener('load', async()=>{
//     state.videoID = 'vzSHcyXfNPw';
//     elements.body.setAttribute('data-videoID', state.videoID);
//     // searchView.clearResult();
//     await controlVideo();
//     await controlTranscript();
//     controlPannel();
// });




/** 
 * PANNEL CONTROLLER
 */
const controlPannel = () => {
    state.pannel = new Pannel(state.transcript)
    if (!state.video || !state.video.player1 && !state.video.player2) {
        pannelView.createPannel(state.pannel.subList, state.pannel.page);
        pannelView.showPannel();
        pannelView.showTranscript();
    } else {
        pannelView.updatePannel(state.pannel.subList, state.pannel.page);
    }
    
};

// Handling Pannel Events
elements.pannelControl.addEventListener('click', (e) => {
    const subList = state.pannel.subList;
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
        videoView.playVideo(state.video, subList, pageNum);
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
    const keyInPage = e.path[0].dataset.subtitlepage;
    const pageNum = state.pannel.pageNum;
    const subList = state.pannel.subList;
    if(keyInPage == pageNum) {    
        const position = state.pannel.getQuestionPosition();
        let res = state.pannel.checkAns(e.key, position);
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
            case('finish'):
                videoView.playVideo(state.video, subList, pageNum);
                state.pannel.saveAns(position);
                pannelView.updateSubtitle(subList, pageNum);
                state.pannel.goToNextPage();

                if(state.pannel.NextPart) clearTimeout(NextPart);
                let dur = subList[pageNum].dur;
                state.pannel.NextPart = setTimeout(() => {
                    pannelView.updatePannel(subList, pageNum);
                    videoView.playVideo(state.video, subList, pageNum);
                }, dur);
                break;
            case('done'):
                break;

        }
    }
});