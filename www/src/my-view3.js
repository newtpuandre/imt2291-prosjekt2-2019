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
import store from './js/store/index';

class MyView3 extends PolymerElement {

  static get properties () {
    return {
      videos: {
        type: Array
      },
      serverURL: {
        type: String
      },
      user: {
        type: Object,
       value: { student: false, teacher: false, admin: false }
      },
      videoSearch: {
        type: Boolean,
        value: false
      },
      searchQuerry:{
        type: String,
      },
      searchResult:{
        type: Array
      }
    }
  }

  constructor () {
    super();

    const data = store.getState();
    this.user = data.user;

    store.subscribe((state)=>{
      this.user = store.getState().user;
    })

    this.serverURL = window.MyAppGlobals.serverURL;

    this.videos = [];
    fetch (`${window.MyAppGlobals.serverURL}api/getAllVideos.php`)
    .then(res=>res.json())
    .then(data=>{
      this.videos = data;
      //console.log(data);
    });
  }

  
  search(e){
    const data = new FormData(e.target.form);
    if(data.get('search') != "") {
    this.set('videoSearch', true);
    this.set('searchQuerry', data.get('search'));

    this.searchResult = [];
    fetch (`${window.MyAppGlobals.serverURL}api/searchVideos.php?q=` + this.searchQuerry)
    .then(res=>res.json())
    .then(data=>{
      this.searchResult = data;
      console.log(this.searchResult);
    });

    }
  }

  reset(e){
    this.set('videoSearch', false);
    this.set('searchQuerry', "");
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

      </style>

      <div class="card">
      <h1>Søk</h1>
      <form class="search" onsubmit="javascript: return false;">
        <input type="text" name="search">
        <button on-click="search">Søk</button>
      </form>
      <template is="dom-if" if="{{!videoSearch}}">
      <h1>Alle Videoer</h1>
        <div class="grid-container">
          <template is="dom-repeat" items="[[videos]]">
            <div class="grid-item">
            <a href="/video/[[item.id]]"><b>[[item.title]]</b></a>
            <!-- TODO: The serverURL shouldn't be hardcoded -->
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"
                  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            </div>
          </template>
        </div>
      </template>
      <template is="dom-if" if="{{videoSearch}}">
      <a href="/view3" on-click="reset"><- Tilbake</a>
      <h1>Søke resultater for: {{searchQuerry}}</h1>
      <div class="grid-container">
          <template is="dom-repeat" items="{{searchResult}}">
            <div class="grid-item">
            <a href="/video/[[item.id]]"><b>[[item.title]]</b></a>
            <!-- TODO: The serverURL shouldn't be hardcoded -->
            <p><img src="[[serverURL]]api/video/getFile.php?id=[[item.id]]&type=thumbnail"
                  width="100" height="52"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Emne: [[item.topic]]</p>
            <p>Fag: [[item.course]]</p>
            <p>Lastet opp av: [[item.name]]</p>
            </div>
          </template>
        </div>
      </template>

      </div>
    `;
  }
}

window.customElements.define('my-view3', MyView3);
