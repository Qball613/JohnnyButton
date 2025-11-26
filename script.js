let countdownInterval;
let endTime;

const hoursElement = document.getElementById('hours');
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const startButton = document.getElementById('startButton');
const messageElement = document.getElementById('message');

// Load saved state from localStorage and server
async function loadState() {
    // First, try to get state from server
    try {
        const response = await fetch('/api/countdown');
        const serverState = await response.json();
        
        if (serverState.isActive && serverState.endTime) {
            endTime = serverState.endTime;
            localStorage.setItem('countdownEndTime', endTime.toString());
            
            const now = Date.now();
            if (endTime > now) {
                startButton.disabled = true;
                startButton.textContent = 'On Cooldown';
                messageElement.textContent = 'Cooldown Active';
                startCountdown();
                return;
            }
        }
    } catch (error) {
        console.log('Could not fetch server state, using localStorage');
    }
    
    // Fall back to localStorage
    const savedEndTime = localStorage.getItem('countdownEndTime');
    if (savedEndTime) {
        endTime = parseInt(savedEndTime);
        const now = Date.now();
        
        if (endTime > now) {
            // Countdown is still active
            startButton.disabled = true;
            startButton.textContent = 'On Cooldown';
            messageElement.textContent = 'Cooldown Active';
            startCountdown();
        } else {
            // Countdown has expired
            localStorage.removeItem('countdownEndTime');
        }
    }
}

function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
        const now = Date.now();
        const timeRemaining = endTime - now;

        if (timeRemaining <= 0) {
            clearInterval(countdownInterval);
            displayTime(0, 0, 0);
            messageElement.textContent = 'Ready! ⚡';
            startButton.disabled = false;
            startButton.textContent = 'I said it again!!!';
            localStorage.removeItem('countdownEndTime');
            
            // Clear server state as well
            fetch('/api/countdown', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    action: 'start',
                    endTime: 0
                })
            }).catch(error => console.error('Error clearing server:', error));
            
            return;
        }

        const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
        const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

        displayTime(hours, minutes, seconds);
    }, 100);
}

function displayTime(hours, minutes, seconds) {
    hoursElement.textContent = String(hours).padStart(2, '0');
    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
}

startButton.addEventListener('click', () => {
    messageElement.textContent = 'Cooldown Active';
    startButton.disabled = true;
    startButton.textContent = 'On Cooldown';
    
    // Set countdown for random time between 24 and 48 hours
    const minHours = 24;
    const maxHours = 48;
    const randomHours = Math.random() * (maxHours - minHours) + minHours;
    endTime = Date.now() + (randomHours * 60 * 60 * 1000);
    localStorage.setItem('countdownEndTime', endTime.toString());
    
    // Update the server with the endTime
    fetch('/api/countdown', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            action: 'start',
            endTime: endTime 
        })
    }).catch(error => console.error('Error updating server:', error));
    
    startCountdown();
});

// Load state when page loads
loadState();
