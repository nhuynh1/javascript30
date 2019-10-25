let countdown;
const buttons = document.querySelectorAll('.timer__button');
const timerDisplay = document.querySelector('.display__time-left'),
      dateDisplay = document.querySelector('.display__end-time');

const formatTime = (seconds) => {
  const remainSeconds = seconds % 60;
  const minutes = Math.round(seconds / 60) % 60;
  const hours = Math.round(seconds / (60 * 60)) % 24;
  const days = Math.round(seconds / (60 * 60 * 24));
  return `${days} days ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainSeconds < 10 ? '0' + remainSeconds : remainSeconds}`
}

const secondsToDate = (monthIndex, day, year = (new Date()).getFullYear()) => {
  const now = new Date(),
        date = new Date(year, monthIndex, day) - now <= 0 ? new Date(year + 1, monthIndex, day) : new Date(year, monthIndex, day);
  return Math.round((date.getTime() - now) / 1000);  
}

const displayTimeLeft = (seconds) => timerDisplay.textContent = formatTime(seconds);

const displayEndDate = (event) => dateDisplay.textContent = `until ${event}!`;

const timer = (seconds) => {
  clearInterval(countdown);
  const now = Date.now(),
        then = now + (seconds * 1000);
  
  displayTimeLeft(seconds);
  
  countdown = setInterval(() => {
    secondsLeft = Math.round((then - Date.now()) / 1000);
    if(secondsLeft <= 0) clearInterval(countdown);
    displayTimeLeft(secondsLeft);
  }, 1000);
}

const startTimer = (e) => {
  const selected = e.currentTarget;
  timer(secondsToDate(parseInt(selected.dataset.monthindex), parseInt(selected.dataset.day)));
  displayEndDate(selected.textContent);
}

buttons.forEach(button => button.addEventListener('click', startTimer));

// on change for datepicker
// get date
// run timer against secondsTOdate of date