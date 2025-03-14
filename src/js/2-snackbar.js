import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('form'),
};

refs.form.addEventListener('submit', e => {
  e.preventDefault();

  const { state, delay } = e.target.elements;
  const msDelay = Number(delay.value);

  return new Promise((res, rej) => {
    setTimeout(() => {
      if (state.value === 'fulfilled') {
        res(`Fulfilled promise in ${msDelay}ms`);
      }

      rej(`Rejected promise in ${msDelay}ms`);
    }, msDelay);
  })
    .then(msg =>
      iziToast.success({
        message: `${msg}`,
        position: 'topRight',
      })
    )
    .catch(msg => iziToast.error({ message: `${msg}`, position: 'topRight' }));
});
