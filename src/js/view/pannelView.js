import {elements} from './base';

export const createPannel = (subList, page = 0) => {
    updateLeftPannel(subList, page);
    updateCenterPannel(subList, page); 
    updateRightPannel(subList, page);
    updateSubtitle(subList, page);
}

export const updatePannel = (subList, page = 0) => {
    updateLeftPannel(subList, page);
    updateRightPannel(subList, page);
    updateSubtitle(subList, page);
}

export const updateLeftPannel = (subList, page) => {
    const leftPannel = elements.leftPannel;
    leftPannel.innerHTML = '';
    const markup = `
    <div class="left_pannel pannel">
        <div class="currentInfo">
            <p class="title">SUBTITLE #</p>
            <div class="value">
                <p class="currentPage">${page + 1}<p class="totalPage"> / ${subList.length}</p></p>
            </div>
        </div>

        <div class="pannel__btn pannel__btn--repl" data-goto="${page}">
                <img class="arrow_white"src="pic/replay-white.png" alt="prev">
                <span class="pannel__btn_text">REPLAY</span>
        </div>
        ${page - 1 >= 0 ? createPannelButton('prev', page) : ''}
    </div>
    `;
    leftPannel.setAttribute('data-currentPage', page);
    leftPannel.insertAdjacentHTML('afterbegin', markup);
};

export const updateCenterPannel = (page) => {
    page = isNaN(page) ? 0 : page;
    const centerPannel = elements.centerPannel;
    const player = centerPannel.querySelector('#player2');
    centerPannel.innerHTML = '';
    const markup = `
    <div class="center pannel">
        <div class="playButton" data-goto="${page}"><p>PLAY</p></div>
    </div>
    `;
    centerPannel.insertAdjacentHTML('afterbegin', markup);
    centerPannel.querySelector('.center').insertAdjacentElement('afterbegin', player);
};
export const updatePlayButton = (page = 0) => {
    const playBut = elements.centerPannel.querySelector('.playButton');
    const markup = `<div class="playButton" data-goto="${page}"><p>PLAY</p></div>`;
    if(!playBut) elements.centerPannel.querySelector('#player2').insertAdjacentHTML('afterend', markup);
};

export const updateRightPannel = (subList, page) => {

    const right = elements.rightPannel;
    right.innerHTML = '';
    const markup = `
    <div class="right_pannel pannel">
        <div class="pageLink">
            <ul>
                ${createPagesItem(subList, page)}
            </ul>
        </div>
        ${page + 1 < subList.length ? createPannelButton('next', page) : ''}
    </div> 
    `;  
    right.insertAdjacentHTML('afterbegin', markup);
}
const createPagesItem = (subList, page) => {

    let markup = '';
    subList.forEach( (e, i) => {
        const temp = `
            <li class="
                pages 
                ${page === i ? 'current' : ''}" data-goto="${i} 
                ${subList[i].status ? 'finished' : ''}">
                    ${i + 1}
            </li>`;
        markup += temp;
    });
    return markup;
}

const createPannelButton = (type, page) => {
    const markup = `
    <div class="pannel__btn pannel__btn--${type}" data-goto="${type === 'prev' ? page - 1 : page + 1}">
        ${type === 'prev' ? '<img class="arrow_white"src="pic/keyboard-left-arrow-button-white.png" alt="prev">' : ''}
        <span class="pannel__btn_text">${type.toUpperCase()}</span>
        ${type === 'next' ? '<img class="arrow_white"src="pic/keyboard-right-arrow-button-white.png" alt="next">' : ''}
    </div>`;
    return markup;
}

export const updateSubtitle = (subList, page) => {
    const subtitle = elements.subtitle;
    subtitle.innerHTML = '';
    const markup = `
    <div class="container" data-goto="${page}">
        <p  class="subtitle_text" data-goto="${page}">${subList[page].question}</p>
    </div> 
    `;
    subtitle.insertAdjacentHTML('afterbegin', markup);
    elements.body.setAttribute('data-subtitlepage', page);
}

export const removePlayBut = () => {
    const centerPannel = elements.centerPannel.querySelector('.playButton');
    if(centerPannel) centerPannel.parentElement.removeChild(centerPannel);
}

export const showPannel = () => {
    elements.pannelControl.classList.replace('hide', 'show');
};

export const hidePannel = () => {
    elements.pannelControl.classList.replace('show', 'hide');
};

export const showTranscript = () => {
    elements.subtitle.classList.replace('hide', 'show');
};

export const hideTranscript = () => {
    elements.subtitle.classList.replace('show', 'hide');
};