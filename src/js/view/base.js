export const elements = {
    body: document.querySelector('.body'),
    searchText: document.querySelector('.search_text'),
    searchSubmit: document.querySelector('.search_submit'),
    searchResult: document.querySelector('.searchResult'),
    recommended: document.querySelector('.recommended'),
    loader: document.querySelector('.loader'),
    leftPannel: document.querySelector('.left_pannel_controller'),
    centerPannel: document.querySelector('.center_pannel_controller'),
    rightPannel: document.querySelector('.right_pannel_controller'),
    subtitle: document.querySelector('.subtitle'),
    pannelControl: document.querySelector('.pannelControl'),
    index: document.querySelector('.index'),
    header: document.querySelector('.header'),
};

export const renderLoader = () => {
    const temp = `
        <div class="loader-background">
            <div class="group"> 
                    <div class="bigSqr">
                    <div class="square first"></div>
                    <div class="square second"></div>
                    <div class="square third"></div>
                    <div class="square fourth"></div>
                    </div>
                    <div class="text">loading</div>
            </div>
        </div>
    `;
    elements.loader.innerHTML = temp;
}
export const clearLoader = () => {
    elements.loader.innerHTML = '';
}