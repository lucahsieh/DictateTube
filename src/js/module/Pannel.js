import { elements } from "../view/base";

export default class Pannel{
    constructor(currentVideo, pageNum = 0) {
        this.videoId = currentVideo.videoID;
        this.subList = currentVideo.subList;
        this.thumbnails = currentVideo.thumbnails;
        this.title = currentVideo.title;
        this.pageNum = pageNum;
        this.counter = 0;
        this.NextPart = null;
    }

    increaseCounter(num = 1) {
        this.counter += num;
    }
    restCounter() {
        this.counter = 0;
    }

    getQuestionPosition() {
        return this.subList[this.pageNum].question.indexOf('_');
    }

    getQustionLength() {
        return this.subList[this.pageNum].question.length;
    }

    getCorrectAns(i) {
        return this.subList[this.pageNum].ans.charAt(i);
    }

    isQustionMatchAns() {
        return this.subList[this.pageNum].ans === this.subList[this.pageNum].question
    }

    goToNextPage(page = this.pageNum + 1) {
        this.pageNum = page + 1 < this.subList.length ? page : this.pageNum;
    }

    // Return 0 --> all matches, 1 --> 1 difference, 2 --> over 2 different char
    isLastCharToGuess() {
        let c = 0;
        let s = 0;
        while( c < 3 && s < this.getQustionLength()) {
            c = this.subList[this.pageNum].question.charAt(s) === this.subList[this.pageNum].ans.charAt(s) ? c : c + 1;
            s++;
        }
        return c;
    }

    checkAns(ch, position) {
        const char = ch.toLocaleLowerCase();
        const corr = this.getCorrectAns(position).toLocaleLowerCase();
        const length = this.getQustionLength();
        const numOfDifference = this.isLastCharToGuess();
        if(numOfDifference === 0){
            return 'done';
        } else if (this.counter >= 2){
            return 'pass';
        } else if (numOfDifference === 1) {
            return char === corr ? 'finish' : 'wrong';
        } else if (position < length - 1) {
            return char === corr ? 'correct' : 'wrong';
        } else {
            return 'done';
        }
    }

    
    saveAns(position) {
        this.subList[this.pageNum].question = 
            this.replaceAt(this.subList[this.pageNum].question, position, this.subList[this.pageNum].ans.charAt(position));

    }

    replaceAt(st, index, char) {
        if (index > st.length - 1) return st;
        return st.substring(0, index) + char + st.substring(index + 1);
    }



    



}