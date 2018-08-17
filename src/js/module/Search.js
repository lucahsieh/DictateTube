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
            const lis = await axios(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&videoCaption=closedCaption&order=viewCount&q=${this.query}&type=video&key=${this.key}`);
            
            // // Iterate each video by videoId
            for (const item of lis.data.items) {
                const vID = item.id.videoId;                   // Get this videoid
                let counter = 0;
                // const eng = await this.hasEngSubtitle(vID);           // Search all subtitles of this videoid

                // if (eng) {
                    const temp = {
                        title: item.snippet.title,
                        videoID: vID,
                        description: item.snippet.description,
                        thumbnails: item.snippet.thumbnails.high.url,
                        hasSubtitle: true,
                    };
                    this.results.push(temp);
                // }
            };

        } catch (error) {
            alert('Error: cannot search!');
            console.log(error);
        }
    }

    // Get the subtitles
    async hasEngSubtitle(vID, lang = 'en') {
        try {
            const eng = await axios(`https://video.google.com/timedtext?lang=${lang}&v=${vID}`);
            let res = eng.data ? true : false;
            return res;
        } catch(error) {
            alert('Error: cannot determinate transcript languge!');
            console.log(error);
        }
    }

    async hasSubtitleByElement(e) {
        const id = e.dataset.videoid;
        let res = false;
        try {
            const sub = await axios(`https://video.google.com/timedtext?lang=en&v=${id}`);
            res = sub.data ? true : false;
            
        } catch (error) {
            console.log(error);
        }
        return res;
    }

    marksVideoWithNoSubByElement(e) {
        const id = e.dataset.videoid;
        this.results.find( e => e.videoID === id).hasSubtitle = false;
        console.log(this.results.find( e => e.videoID === id));
    }
};