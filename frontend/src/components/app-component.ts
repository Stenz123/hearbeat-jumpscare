import {html, render} from "lit-html";
import {store} from "../features";
import {AppViewmodel, createAppViewmodel} from "./AppViewmodel";
import {distinct, map} from "rxjs";

class AppComponent extends HTMLElement {
  connectedCallback() {
    console.log("AppComponent connected");
    store
      .pipe(
        distinct(),
        map(createAppViewmodel)
      )
      .subscribe(appViewModel => this.render(appViewModel));
  }

  render(viewModel: AppViewmodel) {
    render(template(viewModel), this);
  }
}

function template(viewModel: AppViewmodel) {
    return html`
      <div
          style="padding: 0 5%; background-color: ${viewModel.color}; height: 100%; color: #d6d6d6; text-shadow: 1px 1px 8px #000000;">
        <h1 style="text-align: center; margin-top: 0">Heart Rate</h1>
        <div style="display: flex; justify-content: space-evenly; height: 75vh; align-items: center">
          <div>
            <p style="text-align: center; font-size: 12rem">${viewModel.heartRate}</p>
          </div>
        </div>
        <div style="height: 10vh;">
          <h2 style="font-size: 0.8rem; margin-bottom: 1%; padding: 0">Resting Heart Rate:</h2>
          <p style="margin: 0;">${viewModel.restingHeartRate}</p>
        </div>
         ${!viewModel.isAboveMax ? html`
             
            <audio controls autoplay src="../assets/lobster.mp3">
         ` : ""}
      </div>
    `;
}



customElements.define("app-component", AppComponent);