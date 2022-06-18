let video = document.querySelector("video");
let captureBtnCont = document.querySelector(".capture-btn-cont");
let captureBtn = document.querySelector(".capture-btn");
let transparentColor = "transparent";
let recordBtnCont = document.querySelector(".record-btn-cont");
let recordBtn = document.querySelector(".record-btn");

let recorder;
let chunks = [];
let constraints = {
    video: true,
    audio:true
}

navigator.mediaDevices.getUserMedia(constraints)//The Navigator.mediaDevices read-only property returns a "MediaDevices" object, 
//which provides access to connected media input devices like cameras and microphones, as well as screen sharing.
.then((stream) => {
    video.srcObject = stream;

    recorder = new MediaRecorder(stream);//Creates a new MediaRecorder object, given a MediaStream to record. MediaStream() is a constructor.
    recorder.addEventListener("start", (e) => {
        //memory
        chunks = [];
        console.log('rec started');
    });

    //The dataavailable event is fired when the MediaRecorder delivers media data to your application for its use. The data is provided in a Blob object that contains the data
    recorder.addEventListener("dataavailable", (e) => {
        chunks.push(e.data);
        console.log('recording pushed in chunks');
    });
    
    recorder.addEventListener("stop", () => {
        //convert video 
        let blob = new Blob(chunks, { type: 'video/mp4' });
        console.log('rec stopped');
        // download video on desktop
        let videoURL = URL.createObjectURL(blob);
        console.log(videoURL);
        
        // let a = document.createElement('a');
        // a.href = videoURL;
        // a.download = "myVideo.mp4";
        // a.click();
        //store in database
    });


});

//click photo
captureBtnCont.addEventListener("click", () => {
    captureBtn.classList.add("scale-capture");
    let canvas = document.createElement("canvas");

    let tool = canvas.getContext("2d");
    canvas.width = video.videoWidth;//Gets the intrinsic width of a video in CSS pixels, or zero if the dimensions are not known.
    canvas.height = video.videoHeight;

    tool.drawImage(video, 0, 0, canvas.width, canvas.height);

    //applying filters on photo
    tool.fillStyle = transparentColor;
    tool.fillRect(0, 0, canvas.width, canvas.height);

    let imageURL = canvas.toDataURL();
    let img = document.createElement("img");
    img.src = imageURL;
    document.body.append(img);
    setTimeout(() => {
        captureBtn.classList.remove("scale-capture");
    }, 510);

});

//start recording 
let shouldRecord = false;
recordBtnCont.addEventListener("click", () => { 
    shouldRecord = !shouldRecord;
    if (shouldRecord) {
        recordBtn.classList.add("scale-record");

        //recording start
        recorder.start();//Begins recording media; this method can optionally be passed a timeslice argument with a value in milliseconds. 
        //If this is specified, the media will be captured in separate chunks of that duration, rather than the default behavior of recording the media in a single large chunk.
        
        //start timer
        startTimer();
    }

    else {
        recordBtn.classList.remove("scale-record");

        //stop the recording
        recorder.stop();//Stops recording, at which point a dataavailable event containing the final Blob of saved data is fired. No more recording occurs.
        
        // stop the timer
        stopTimer();
    }

});

let timer = document.querySelector('.timer');

let counter = 3590;
let timerID;
function startTimer() {
    timer.style.display = 'block';
    function displayTimer(){
        let totalSeconds = counter;

        let hours = Number.parseInt(totalSeconds / 3600);
        totalSeconds = totalSeconds % 3600;
        console.log(`${hours} hours and ${totalSeconds} totalSeconds`)

        let minutes = Number.parseInt(totalSeconds / 60);
        totalSeconds = totalSeconds % 60;
        console.log(`${minutes} minutes and ${totalSeconds} totalSeconds`)


        let seconds = totalSeconds;
        console.log(`${seconds} seconds`)

        hours = (hours < 10) ? `0${hours}` : hours;
        minutes = (minutes < 10) ? `0${minutes}` : minutes;
        seconds = (seconds < 10) ? `0${seconds}` : seconds;
        timer.innerText = `${hours}:${minutes}:${seconds}`;

        counter++;
    }
    timerID = setInterval(displayTimer, 1000);
    counter = 3650;
}

function stopTimer() {
    clearInterval(timerID);
    timer.innerText = "00:00:00";
    timer.style.display = 'none';
}


//filters add 

let filterLayer = document.querySelector(".filter-layer");
let allFilters = document.querySelectorAll(".filter");

allFilters.forEach((filterElem) => {
    filterElem.addEventListener('click', () => {
        transparentColor = getComputedStyle(filterElem).getPropertyValue('background-color');
        //The Window.getComputedStyle() method returns an object containing the values of all CSS properties of an element

        //The CSSStyleDeclaration.getPropertyValue() method interface returns a string containing the value of a specified CSS property.
        
        filterLayer.style.backgroundColor = transparentColor;
    })
})

//gallery
