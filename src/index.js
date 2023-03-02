import { createElement } from 'react';
import { createRoot } from 'react-dom/client';

import App from './components/App';

const domContainer = document.querySelector('#root');
const root = createRoot(domContainer);
root.render(createElement(App));