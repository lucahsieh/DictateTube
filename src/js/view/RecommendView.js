import { elements } from './base';

export const renderRecommended = (results, title ,page = 1, videoPerPage = 12) => {
    const temp = `
    <div class="container">
        <div class="row row_0 renderTitle">
            <p class="title">${title.toUpperCase()}</p>
        </div>
        <div class="row row_1 renderItems"></div>
        <div class="row row_2 renderButtons"></div>
    </div> 
    `;
    elements.recommended.insertAdjacentHTML('beforeend', temp);
    
    const start = (page - 1) * videoPerPage;
    const end = page * videoPerPage;
    renderItems(results.slice(start, end));
    renderButtons(page, results.length, videoPerPage);
};

const renderItems = (items) => {
    items.forEach((e,i) => {
        const markup = `
        <div class="recommended_item" data-videoId="${e.videoID}"  data-videoIndex="${i}">
            <div class="image" style="background-image: url(${e.thumbnails});"></div>
            <div class="overlay"></div>
            <div class="text"><p class="title_recommended" >${e.title}</p></div>
        </div>
        `;
        elements.recommended.querySelector('.renderItems').insertAdjacentHTML('beforeend', markup); 
    });
}



const createButton = (page, type) => {
    const markup = `
    <div class="recommended__btn recommended__btn--${type}" data-goto="${type === 'prev'? page - 1 : page + 1}">
        ${type === 'prev' ? '<i class="material-icons">chevron_left</i>' : ''}
        <span class="recommended__btn_text">${type.toUpperCase()}</span>
        ${type === 'next' ? '<i class="material-icons">chevron_right</i>' : ''}
    </div>
    `;
    return markup;
};

const renderButtons = (page, numResults, videoPerPage) => {
    const pages = Math.ceil(numResults/ videoPerPage);
    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page > 1 && page !== pages) {
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1){
        button = createButton(page, 'prev');
    } else {
        button = '';
    };
    elements.recommended.querySelector('.renderButtons').insertAdjacentHTML('beforeend', button);
}

export const clearResult = () => elements.recommended.innerHTML = '';

export const renderIndex = () => {
    const temp = `
        <div class="container">
            <h1 class="welcome">Welcome,</h1>
            <h2 class="content">DictateTube helps you to improve your English listening, spelling, writing and typing skills by listening and typing each letter you hear. You can choose videoes that you like on YouTube to start your dictation.</h2>
        </div> 
    `
    elements.index.insertAdjacentHTML('afterbegin', temp);
}


export const showRecommend = () => {
    elements.recommended.classList.replace('hide', 'show');
};

export const hideRecommend = () => {
    elements.recommended.classList.replace('show', 'hide');
};

export const showIndex = () => {
    elements.index.classList.replace('hide', 'show');
};

export const hideIndex = () => {
    elements.index.classList.replace('show', 'hide');
};