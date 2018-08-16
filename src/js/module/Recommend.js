import {YouTubeAPIkey} from '../config';
import axios from 'axios';

// const temp = {
//     title: item.snippet.title,
//     videoID: vID,
//     description: item.snippet.description,
//     thumbnails: item.snippet.thumbnails.high.url,
// };
// this.results.push(temp);
// }

export default class Recommend{

    constructor(db) {
        this.db = db;
    }

    async getRecommendFromFirebase () {
        const snapeshot = await this.db.collection('recommendationList').get();

        const videos = [];
        snapeshot.forEach((e) => {
            const temp = {
                title: e.data().title,
                videoID: e.data().videoID,
                description: e.data().description,
                thumbnails: e.data().thumbnails,
            };
            videos.push(temp);
        })
        return videos;        
    }

}