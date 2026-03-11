import './index.css';
import './libs/configs/dayjs';
import { mount } from './app/bootstrap';

const rootElement = document.getElementById('root');
if (rootElement) {
  mount(rootElement);
}
