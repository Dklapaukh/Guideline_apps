// Browser entry for a built app: reads the embedded, already-checked spec and starts the runtime.
import { mount } from './runtime.js';
const data = JSON.parse(document.getElementById('spec').textContent);
window.__app = mount(document.getElementById('app'), data);
