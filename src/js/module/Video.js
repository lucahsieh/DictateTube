
export default class Video{

    loadPlayer(id) {
        if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
    
            // 2. This code loads the IFrame Player API code asynchronously.
            var tag = document.createElement('script');
    
            tag.src = "https://www.youtube.com/iframe_api";
            var firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
            window.onYouTubePlayerAPIReady = () => {
                this.onYouTubePlayer(id);
            };
        } else {
            this.onYouTubePlayer(id);
        }
    }

    onYouTubePlayer(id) {
        console.log(id+' onYouTubePlayer');
        this.player1 = new YT.Player('player1', {
          height: '500',
          width: '100%',
          videoId: id,
          playerVars: {
            color: 'white',
            controls: 0,
            rel: 0,
            showinfo: 0,
            disablekb: 1,
            enablejsapi: 1,
            modestbranding: 1,
          },
          
          events: {
            'onReady': this.palyVideo1,
          }
        });

        this.player2 = new YT.Player('player2', {
            height: '500',
            width: '100%',
            videoId: id,
            playerVars: {
              color: 'white',
              controls: 0,
              rel: 0,
              showinfo: 0,
              disablekb: 1,
              enablejsapi: 1,
              modestbranding: 1,
            },  
            events: {
                'onReady': this.palyVideo2,
              }
        });

    }

    palyVideo1(event) {
        const palyer = event.target;
        palyer.mute();
    }

    palyVideo2(event) {
        const palyer = event.target;
    }

    replaceVideo(id) {
        console.log(id+' replaceVideo');
        this.player2.cueVideoById({videoId: id,
            startSeconds: 0,
            endSeconds: 0,
            suggestedQuality: 'default'
        });
        this.player1.cueVideoById({videoId: id,
            startSeconds: 0,
            endSeconds: 0,
            suggestedQuality: 'default'
        });
        
    }

}

