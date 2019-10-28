let countdown;
const buttons = document.querySelectorAll('.timer__button'),
      customEvent = document.customForm.event;
const timerDisplay = document.querySelector('.display__time-left'),
      dateDisplay = document.querySelector('.display__end-time');

const formatTime = (seconds) => {
  const remainSeconds = seconds % 60;
  const minutes = Math.floor(seconds / 60) % 60;
  const hours = Math.floor(seconds / (60 * 60)) % 24;
  const days = Math.floor(seconds / (60 * 60 * 24));
  return `${days} ${days > 1 || days === 0 ? 'days' : 'day'} ${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${remainSeconds < 10 ? '0' + remainSeconds : remainSeconds}`;
}

const secondsToDate = (monthIndex, day, year = (new Date()).getFullYear()) => {
  const now = new Date(),
        date = new Date(year, monthIndex, day) - now <= 0 ? new Date(year + 1, monthIndex, day) : new Date(year, monthIndex, day);
  /* inconsistencies may occur here due to daylight savings time for regions that observe daylight savings time; libraries like Moment Timezone will help: https://momentjs.com/timezone */
  return Math.round((date - now) / 1000);
}

const displayTimeLeft = (seconds) => timerDisplay.textContent = formatTime(seconds);
const displayEndDate = (event) => dateDisplay.textContent = `until ${event}`;

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
  timer(secondsToDate(parseInt(selected.dataset.monthindex),      parseInt(selected.dataset.day)));
  displayEndDate(selected.textContent);
}

const startCustomTimer = (e) => {
  e.preventDefault();
  const dateArray = (e.currentTarget.value).split("-")
                        .map(n => parseInt(n));
  if(dateArray.some(n => isNaN(n))) return;
  
  const [year, month, day] = dateArray;
  timer(secondsToDate(month - 1, day, year));
  displayEndDate(`${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`);
}

window.onload = () => {
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const year = minDate.getFullYear(),
        month = minDate.getMonth() + 1,
        day = minDate.getDate();
  
  customEvent.setAttribute('min', `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`)
}
buttons.forEach(button => button.addEventListener('click', startTimer));
customEvent.addEventListener('change', startCustomTimer);