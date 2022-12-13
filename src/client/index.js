import { planHandler } from './js/app';

import './styles/reset.scss';
import './styles/header.scss';
import './styles/main.scss';
import './styles/footer.scss';
console.log(process.env.NAME);

window.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  planHandler();
});

export { planHandler };
