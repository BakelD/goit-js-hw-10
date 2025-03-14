import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';
import 'flatpickr/dist/flatpickr.min.css';

console.log(iziToast);

const refs = {
  picker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  outputDays: document.querySelector('[data-days]'),
  outputHours: document.querySelector('[data-hours]'),
  outputMinutes: document.querySelector('[data-minutes]'),
  outputSeconds: document.querySelector('[data-seconds]'),
};

let userSelectedDate;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate - Date.now() <= 0) {
      iziToast.error({
        title: 'Incorrect data',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      refs.startBtn.disabled = true;
      return;
    }

    userSelectedDate = selectedDate;
    refs.startBtn.disabled = false;
  },
};

const fp = flatpickr(refs.picker, options);
refs.startBtn.disabled = true;

refs.startBtn.addEventListener('click', e => {
  e.target.disabled = true;
  refs.picker.disabled = true;

  const timerId = setInterval(() => {
    const ms = userSelectedDate - Date.now();

    if (ms <= 0) {
      clearInterval(timerId);
      refs.picker.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(ms);

    refs.outputDays.textContent = addLeadingZero(days);
    refs.outputHours.textContent = addLeadingZero(hours);
    refs.outputMinutes.textContent = addLeadingZero(minutes);
    refs.outputSeconds.textContent = addLeadingZero(seconds);
  }, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}
