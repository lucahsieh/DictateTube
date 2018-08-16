import {YouTubeAPIkey} from '../config';
import axios from 'axios';

export default class Search{
    constructor(query) {
        this.query = query;
        this.key = YouTubeAPIkey;
        this.results = [];
    }

    async getResults() {
        try {
            // Get result of query search
            const lis = await axios(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&videoCaption=closedCaption&order=viewCount&q=${this.query}&type=video&key=${this.key}`);
            
            // // Iterate each video by videoId
            for (const item of lis.data.items) {
                const vID = item.id.videoId;                   // Get this videoid
                const eng = await this.getLang(vID);        // Search all subtitles of this videoid
                // const ind = this.engSubIndex(eng);          // return the eng-subtitle index of all subtitles

                if (eng) {
                    const temp = {
                        title: item.snippet.title,
                        videoID: vID,
                        description: item.snippet.description,
                        thumbnails: item.snippet.thumbnails.high.url,
                    };
                    this.results.push(temp);
                }
            };

        } catch (error) {
            alert('Error: cannot search!');
            console.log(error);
        }
    }

    async getLang(vID, lang = 'en') {
        try {
            const eng = await axios(`https://video.google.com/timedtext?lang=${lang}&v=${vID}`);
            let res = eng.data ? true : false;
            return res;
        } catch(error) {
            alert('Error: cannot determinate transcript languge!');
            console.log(error);
        }
    }

    // engSubIndex(eng) {
    //     if (eng.data.items.length === 0) {
    //         return -1;
    //     } else {
    //         let indEng = -1;
    //         eng.data.items.forEach((e, i) => {
    //             if(indEng === -1) indEng = e.snippet.language === 'en' ? i : -1 ;
    //         });
    //         return indEng;
    //     };
    // }

};