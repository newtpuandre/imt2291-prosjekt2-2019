import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class AdminView1 extends PolymerElement {
  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
        <div class="circle">1</div>
        <h1>Admin modul 1</h1>
      </div>
    `;
  }
}

customElements.define('admin-view1', AdminView1);
