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

    addDataToFirebase(ti, v, th, d = ' ') {
        this.db.collection("recommendationList").add({
            title: ti,
            videoID: v,
            description: d,
            thumbnails: th,
        })
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
    }
}