import { showAlert1 } from './js/app';

import './styles/reset.scss';
import './styles/header.scss';
import './styles/main.scss';
import './styles/footer.scss';
console.log(process.env.NAME);

window.addEventListener('DOMContentLoaded', (e) => {
  e.preventDefault();
  showAlert1();
});

export { showAlert1 };
