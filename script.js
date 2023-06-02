
const searchInput = document.getElementById("search");
const apiKey = "AIzaSyDwIqMPAO23WGOX_gMYC0VIc30rC5HcjeI";
localStorage.setItem("api_key" , apiKey);
const videoContainer = document.getElementById("video-container");

function searchVideos() {
  let searchValue = searchInput.value;
  fetchVideos(searchValue);
}

async function fetchVideos(searchValue) {
    let endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=30&q=${searchValue}&key=${apiKey}`;
  
    try {
      let response = await fetch(endpoint);
      let result = await response.json();
  
      for (let i = 0; i < result.items.length; i++) {
        let video = result.items[i];
        let videoStats = await fetchStats(video.id.videoId);
  
        if (videoStats.items && videoStats.items.length > 0 ) {
          video.statistics = videoStats.items[0].statistics;
           video.duration  = videoStats.items[0].contentDetails.duration;
        } else {
          // Handle case when video statistics are not available
          video.statistics = { viewCount: "N/A" };
        }
       
      }
  
    //   console.log(result);
      thumbnails(result.items);
    } catch (error) {
      alert("Something went wrong" + error);
    }
  }

async function fetchStats(videoId) {
  try {
    const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&key=${apiKey}&id=${videoId}`;

    let response = await fetch(endpoint);
   
    let result = await response.json();
    console.log(result);
    return result;
  } catch (error) {
    alert("An error occurred when fetching the statistics of the video.");
  }
}

function thumbnails(items) {
  videoContainer.innerHTML = ""; // Clear previous results

  for (let i = 0; i < items.length; i++) {
    let videoItem = items[i];
    let thumbUrl = videoItem.snippet.thumbnails.high.url;
    let videoElement = document.createElement("div");
    videoElement.className = "videoElement";

    videoElement.addEventListener("click" , () => {
        navigateToVideo(videoItem.id.videoId);
    })
    let videoChild = `
      <img src="${thumbUrl}" /> 
      <b>${convertDuration(videoItem.duration)}</b>
      <p class="title">${videoItem.snippet.title}</p>
      <p class="channelName">${videoItem.snippet.channelTitle}</p>
      <p class="view-count">${getViewCount(videoItem.statistics.viewCount)} views  10hrs ago</p>
    `;
    videoElement.innerHTML = videoChild;
    videoContainer.append(videoElement);
  }
}

function getViewCount(views){
    if(views < 1000) return views;
    else if(views  >= 1000 && views <= 999999){
        return parseInt(views /1000 )+ "K";
    }

    return parseInt(views/1000000) + "M";
}


function convertDuration(duration) { // need to wrk on it
    if(!duration) return "NA";
    
    // PT2H33M23S
    let hrs = duration.slice(2,5);
    let min = duration.slice(5,7);
    let seconds ;
    if(duration > 8){
        seconds = duration.slice(8,10);
    }
    let str =  `${hrs}:${min}`;
    seconds && (str += `:${seconds}`);
    return str;
  }
  
  function navigateToVideo(videoId){
    let path = `/video.html`;
    if(videoId){
         document.cookie = `video_id=${videoId}; path = ${path}`;
        // window.location.href = "http://127.0.0.1:5500/video.html";
         let pageLink = document.createElement("a");
         pageLink.href = "http://127.0.0.1:5500/video.html";
         pageLink.target = "_blank";
         pageLink.click();
         
      
    }else {
        alert("See the video in the youtube");
    }
  }
  