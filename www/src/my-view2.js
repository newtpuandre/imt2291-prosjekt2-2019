/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import './shared-styles.js';

class MyView2 extends PolymerElement {

  constructor () {
    super();

    this.courses = [];
    fetch (`${window.MyAppGlobals.serverURL}api/getCourses.php`)
    .then(res=>res.json())
    .then(data=>{
      this.courses = data;
      console.log(data);
    });
  }

  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }
      </style>

      <div class="card">
      <h1>Søk</h1>
      <input type="text">
      <button>Søk</button>
        <h1>Emner</h1>
        <template is="dom-repeat" items="[[courses]]">
        <!-- <a href=""> -->
          <b>[[item.course]]</b> 
          <p>Videoer i dette emnet: [[item.count]]</p>
        <!-- </a> -->
        </template>
      </div>
    `;
  }

  static get properties () {
    return {
      courses: {
        type: Array
      }
    }
  }

}

window.customElements.define('my-view2', MyView2);
