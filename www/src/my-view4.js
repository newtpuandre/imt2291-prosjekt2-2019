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
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import store from './js/store/index';

class MyView4 extends PolymerElement {

  static get properties () {
    return {
      playlists: {
        type: Array
      },
      user: {
        type: Object,
       value: { student: false, teacher: false, admin: false }
      },
      playlistSearch: {
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

    //Get all playlists
    this.playlists = [];
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/getAllPlaylists.php`)
    .then(res=>res.json())
    .then(data=>{
      this.playlists = data;
      //console.log(data);
    });
  }

  /**
   * Search for a playlist
   */
  search(e){
    const data = new FormData(e.target.form);
    data.append('search', this.searchQuerry);
    if(data.get('search') != "") {
    this.set('playlistSearch', true);
    this.set('searchQuerry', data.get('search'));

    //Get playlists
    this.searchResult = [];
    fetch (`${window.MyAppGlobals.serverURL}api/playlist/searchPlaylist.php?q=` + this.searchQuerry)
    .then(res=>res.json())
    .then(data=>{
      this.searchResult = data;
      //console.log(this.searchResult);
    });

    }
  }

  //Reset search and go to previous page
  reset(e){
    this.set('playlistSearch', false);
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
      <form class="search" onsubmit="javascript: return false;">
      <paper-input label="Søk" value="{{searchQuerry}}" maxlength="64" style="width:240px;"></paper-input>
      <paper-button raised><button on-click="search">Søk</button></paper-button>
      </form>
      <template is="dom-if" if="{{!playlistSearch}}">
        <h1>Alle Spillelister</h1>
        <hr>
        <div class="grid-container">
          <template is="dom-repeat" items="[[playlists]]">
            <div class="grid-item">
            <b><a href="/playlist/[[item.id]]">[[item.name]]</a></b>
            <p><img src="[[item.thumbnail]]" width="320" height="180"></p>
            <p>Beskrivelse: [[item.description]]</p>
            <p>Laget av: [[item.lectname]]</p>
            </div>
          </template>
      </template>
      <template is="dom-if" if="{{playlistSearch}}">
      <a href="/view4" on-click="reset"><- Tilbake</a>
      <h1>Søkeresultater for: {{searchQuerry}}</h1>
        <h1>Alle Spillelister</h1>
        <hr>
        <div class="grid-container">
          <template is="dom-repeat" items="{{searchResult}}">
            <div class="grid-item">
            <b><a href="/playlist/[[item.id]]">[[item.name]]</a></b>
            <p><img src="[[item.thumbnail]]" width="320" height="180"></p>
            <p>Beskrivelse: [[item.description]]</p>
            </div>
          </template>
          </div>
      </template>
      </div>
    `;
  }
}

window.customElements.define('my-view4', MyView4);
