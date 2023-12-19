const play = document.getElementById('play');
const reset = document.getElementById('reset');
const mark = document.getElementById('mark');
const markedElement = document.querySelector('.marked');
const recordContainer = document.querySelector('.record');

let timer;
let isPlayed = false;
let elapsedTime = 0;
let lapTimes = [];

play.addEventListener('click', togglePlay);
mark.addEventListener('click', toggleMark);
reset.addEventListener('click', resetTimer);

// Function to handle play/pause functionality
function togglePlay() {
    if (isPlayed) {
        play.innerHTML = '<i class="material-icons" style="font-size:20px;color:white">play_arrow</i>';
        clearInterval(timer);
        isPlayed = false;
    } else {
        play.innerHTML = '<i style="font-size:15px" class="fa">&#xf04c;</i>';
        clearInterval(timer);

        timer = setInterval(() => {
            elapsedTime += 100;

            updateDisplay();
        }, 100);

        isPlayed = true;
    }
}

function toggleMark() {
    if (isPlayed) {
        // Always make the marked element visible
        markedElement.style.visibility = 'visible';

        lapTimes.push(elapsedTime);
        updateRecord();
    }
}


function resetTimer() {
    play.innerHTML = '<i class="material-icons" style="font-size:20px;color:white">play_arrow</i>';
    clearInterval(timer);
    isPlayed = false;
    elapsedTime = 0;
    lapTimes = [];
    updateDisplay();
    updateRecord();
}

function updateDisplay() {
    let hours = Math.floor(elapsedTime / (60 * 60 * 1000));
    let minutes = Math.floor((elapsedTime % (60 * 60 * 1000)) / (60 * 1000));
    let seconds = Math.floor((elapsedTime % (60 * 1000)) / 1000);
    let milliseconds = (elapsedTime % 1000).toString().padStart(3, '0');

    let htmlContent = `
        <div class="hour">${String(hours).padStart(2, '0')}<div class="tooltip">hr</div></div>:  
         <div class="minute">${String(minutes).padStart(2, '0')}<div class="tooltip">min</div>:</div>
        <div class="seconds">${String(seconds).padStart(2, '0')}<div class="tooltip">sec</div>.</div>
        <div class="mili-secs">${milliseconds.slice(0, 2)}</div>
    `;

    document.querySelector('.container').innerHTML = htmlContent;
}


function updateRecord() {
    const recordContainer = document.querySelector('.all-records');
    recordContainer.innerHTML = '';

    let fastestIndex = -1;
    let slowestIndex = -1;
    let fastestTime = Infinity;
    let slowestTime = -Infinity;

    lapTimes.forEach((lapTime, index) => {
        const lapRecord = document.createElement('div');
        lapRecord.classList.add('lap-record');

        const lapNumber = document.createElement('div');
        lapNumber.innerText = index + 1;

        const lapTimeDisplay = document.createElement('div');
        lapTimeDisplay.innerText = formatTime(lapTime);

        const totalDisplay = document.createElement('div');
        totalDisplay.innerText = formatTime(calculateTotalTime(index));

        lapRecord.appendChild(lapNumber);
        lapRecord.appendChild(lapTimeDisplay);
        lapRecord.appendChild(totalDisplay);

        recordContainer.appendChild(lapRecord);

        if (lapTime < fastestTime) {
            fastestTime = lapTime;
            fastestIndex = index;
        }

        if (lapTime > slowestTime) {
            slowestTime = lapTime;
            slowestIndex = index;
        }
    });

    if(lapTimes.length > 1){
    if (fastestIndex !== -1) {
        recordContainer.children[fastestIndex].classList.add('fastest-lap');
    }

    if (slowestIndex !== -1) {
        recordContainer.children[slowestIndex].classList.add('slowest-lap');
    }
  }
}

function formatTime(time) {
    let hours = Math.floor(time / (60 * 60 * 1000));
    let minutes = Math.floor((time % (60 * 60 * 1000)) / (60 * 1000));
    let seconds = Math.floor((time % (60 * 1000)) / 1000);
    let milliseconds = (time % 1000).toString().padStart(3, '0');

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${milliseconds.slice(0, 2)}`;
}

function calculateTotalTime(index) {
    return lapTimes.slice(0, index + 1).reduce((total, lapTime) => total + lapTime, 0);
}
