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
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import './shared-styles.js';

class MyView2 extends PolymerElement {

  constructor () {
    super();

  }

  static get observers() {
    return [
        'loadData(subroute)'
    ]
  }

  loadData(subroute){
    if (subroute.prefix == "/view2"  && subroute.path == ""){
      this.set('searchMode', false);
      this.courses = [];
      fetch (`${window.MyAppGlobals.serverURL}api/course/getCourses.php`)
      .then(res=>res.json())
      .then(data=>{
        this.courses = data;
        console.log(data);
      });

    } else if (subroute.prefix == "/view2"  && subroute.path != "") {
      this.set('searchMode', true);
      this.videos = [];
      fetch (`${window.MyAppGlobals.serverURL}api/course/searchCourse.php?q=`+subroute.path)
      .then(res=>res.json())
      .then(data=>{
        this.videos = data;
        console.log(data);
      });
    }
  }


  static get template() {
    return html`
      <style include="shared-styles">
        :host {
          display: block;

          padding: 10px;
        }

        .grid-container {
          display: grid;
          grid-template-columns: auto auto auto;
          padding: 5px;
        }
    
        .grid-item {
          background-color: rgba(255, 255, 255, 0.8);
          border: 1px solid rgba(0, 0, 0, 0.8);
          border-radius: 5px;
          margin: 2px;
          padding: 10px;
          text-align: left;
        }

        paper-button {
          padding:0;
        }

        paper-button::shadow .button-content {
          padding:0;
        }

        paper-button button {
          padding:1em;
          background-color: transparent;
          border-color: transparent;
        }

        paper-button button::-moz-focus-inner {
          border: 0;
        }
      </style>

      <div class="card">
      <h1>Søk</h1>
      <paper-input label="Søk" value="{{searchQuery}}" maxlength="64" style="width:240px;"></paper-input>
      <a href="/view2/[[searchQuery]]"><paper-button raised><button>Søk</button></paper-button></a>
        <template is="dom-if" if="{{!searchMode}}">
        <h1>Emner</h1>
          <template is="dom-repeat" items="[[courses]]">
            <b><a href="/view2/[[item.course]]">[[item.course]]</a></b> 
            <p>Videoer i dette emnet: [[item.count]]</p>
          </template>
        </template>
        <template is="dom-if" if="{{searchMode}}">
        <p><a href="/view2"><- Tilbake</a></p>
        <h1>Videoer i emne : </h1>
        <div class="grid-container">
        <template is="dom-repeat" items="[[videos]]">
            <div class="grid-item">
            <b><a href="/video/[[item.id]]">[[item.title]]</a></b>
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            </div>
          </template>
          </div>
        </template>
        
      </div>
    `;
  }

  static get properties () {
    return {
      courses: {
        type: Array
      },
      videos:{
        type: Array
      },
      searchMode: {
        type: Boolean,
        value: false
      },
      serverURL: {
        type: String,
        value: window.MyAppGlobals.serverURL
      },
      searchQuery:{
        type: String,
        value: ""
      }
    }
  }

}

window.customElements.define('my-view2', MyView2);
