let cookie = document.cookie;
let videoId = cookie.split("=")[1];
const apiKey = localStorage.getItem("api_key");
// console.log(apikey);
/*
setTimeout(() => {
    if(YT){
        new YT.Player("frame-container" , {
            height: "400" ,
            width:  "600" ,
            videoId , 
            events: {
                onReady : () => {
                    console.log("Video Loaded");
                }
            }
        }) 
    }
} , 1000);
*/

// to solve the error when video is  not loading into the page or to onload the script
let firstScript = document.getElementsByTagName("Script")[0];
firstScript.addEventListener("load", onLoadScript);

function onLoadScript() {
    if (YT) {
        new YT.Player("frame-container", {
            height: "500",
            width: "700",
            videoId,
            events: {
                onReady: (event) => {
                    // console.log(event.target.videoTitle);
                    document.title = event.target.videoTitle;
                    extractVideoDetails(videoId);
                    fetchStats(videoId);
                }
            }
        })
    }
}

const statsContainer = document.getElementsByClassName("video-details")[0];



async function extractVideoDetails(videoId) {
    let endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${apiKey}`;

    try {
        let response = await fetch(endpoint);
        let result = await response.json();
        console.log(result);
        renderComments(result.items);
    } catch (error) {
        alert("some error :" + error);
    }
}

async function fetchStats(videoId) {

    let endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&key=${apiKey}&id=${videoId}`;

    try {
        const response = await fetch(endpoint);
        const result = await response.json(); // contains title , description , statistics 
        console.log(result, " stats");
        const item = result.items[0];

        const title = document.getElementById("title");
        title.style.color = "white";
        title.style.fontSize = "24px";
        title.innerHTML = item.snippet.title;
        statsContainer.innerHTML = ` 
        <div class="profile">
        <img src="https://cdn.pixabay.com/photo/2022/09/11/06/01/apple-7446229_1280.png" class="channel-logo" alt="">
        <div class="owner-details">
            <span style="color: white;">${item.snippet.channelTitle}</span>
            <span>20 Subscribers</span>
        </div>
    </div>

    <div class="stats">
        <div class="like-container">
            <div class="like">
                <i class='bx bxs-like'></i>
                <span>${item.statistics.likeCount}</span>
            </div>
            <div class="like">
                <i class='bx bxs-dislike' ></i>
            </div>
        </div>

        <div class="comment-container">
            <i class='bx bxs-comment-detail' ></i>
            <span>${item.statistics.commentCount}</span>
        </div>
    </div>`;
        console.log("in the fetchstats funtonion")
    } catch (error) {
        //   handle later
        alert('failed to load ' + error);
    }
}

function renderComments(commentList) {

    const commentContainer = document.getElementById("comments-container");
    for (let i = 0; i < commentList.length; i++) {
        let comment = commentsList[i];
        let commentElement = document.createElement("div");
        commentElement.className = "comment";
        commentElement.innerHTML = `
        <img src="https://cdn.pixabay.com/photo/2022/09/11/06/01/apple-7446229_1280.png" alt="">
       <div class="comment-right-half">
        <b>Sriram Viswanathan</b>
        <p>some comment data here</p>
        <div style="display: flex; gap:20px">
            <div class="like">
                <i class='bx bxs-like'></i>
                <span>20</span>
            </div>
            <div class="like">
                <i class='bx bxs-dislike'></i>
                <span>20</span>
            </div>
        </div>
    </div>
   `;

    }
}
