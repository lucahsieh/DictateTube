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
            console.log(xmlObj);
            const jsObj = this.convertXMLtoJsObj(xmlObj);
            console.log(jsObj);
            return this.createTranscriptArr(jsObj);
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
            let temp = {};
            temp.start = parseInt(e.attributes.start);
            temp.dur = parseFloat(e.attributes.dur) * 1.3 * 1000;
            temp.question = this.convertCharToBullet(e.elements[0].text);
            temp.ans = e.elements[0].text;
            temp.status = false;
            subtitles.push(temp);
        });
        return subtitles;
    }

    convertCharToBullet(str) {
        return str.replace(/[a-zA-Z]/g, '_');
    }



    


}