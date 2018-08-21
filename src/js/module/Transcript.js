import axios from 'axios';
import converter from 'xml-js';

export default class Transcript{
    constructor(videoID, lang) {
        this.videoID = videoID;
        this.lang = lang;
    }


    async getTranscript() {
        try {
            // get XML file from YouTube.
            const xmlObj = await axios(`https://video.google.com/timedtext?lang=${this.lang}&v=${this.videoID}`);
            const jsObj = this.convertXMLtoJsObj(xmlObj);
            const arr = this.createTranscriptArr(jsObj);
            return this.reCalcDuration(arr);
        } catch (error) {
            console.log(error);
        }
    }

    // paras into js object
    convertXMLtoJsObj(xmlFile) {
        const xml = xmlFile.data;
        const option = {ignoreComment: true, alwaysChildren: true};
        return converter.xml2js(xml, option);
    }

    // Create each subtitle
    createTranscriptArr(object) {
        const subtitles = [];

        object.elements[0].elements.forEach(e => {
            let subtitle = this.deletNoneChar(e.elements[0].text);
            let temp = {};
            temp.start = parseInt(e.attributes.start);
            temp.dur = parseFloat(e.attributes.dur) * 1.3 * 1000;
            temp.ans = subtitle;
            temp.question = this.convertCharToBullet(subtitle);
            temp.status = false;
            subtitles.push(temp);
        });
        return subtitles;
    }

    convertCharToBullet(str) {
        return str.replace(/[a-zA-Z]/g, '_');
    }

    deletNoneChar(str) {
        let res = str.replace(/&(\w+);/g, ' ');
        res = res.replace(/(<([^>]+)>)/g, ' ');
        res = res.replace(/(\[([^\]]+)\])/g, ' ');
        return res;
    }

    reCalcDuration(arr) {
        const buffer = 1.2;
        const linger = 0.9;
        arr.forEach((e, i) => {
            if(i === 0) {
                e.start = 0;
                e.dur = (arr[1].start + linger) * buffer * 1000;
            } else if ( i > 0 && i < arr.length - 1) {
                e.start = e.start - 1;
                e.dur = (arr[i + 1].start - arr[i].start + linger) * buffer * 1000;
            } else {
                e.dur = e.dur;
            }
        })
        return arr;
    }



    


}