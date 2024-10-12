import {html, render} from "lit-html";
import {store} from "../features";
import {
    AppViewmodel,
    createAppViewmodel,
    calibrateButtonClicked,
    sliderChanged,
    resetButtonClicked
} from "./AppViewmodel";
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
                style="padding: 0 0; background-color: ${viewModel.color}; height: 100%; color: white; text-shadow: 1px 1px 5px #000000;">
            <h1 style="text-align: center; margin-top: 0">Heart Rate</h1>
            <div style="display: flex; justify-content: space-evenly; height: 70vh; align-items: center">
                <div>
                    <p style="text-align: center; font-size: 12rem">${viewModel.heartRate}</p>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between">
                <div style="height: 10vh; margin-left: 5vw">
                    <h2 style="font-size: 1rem; margin-bottom: 1%; padding: 0">Heart Rate Threshold:</h2>
                    <p style="margin: 0; font-size: 1rem;">${viewModel.maxHeartRate}</p>
                    <h2 style="font-size: 1rem; margin-bottom: 1%; padding: 0">Resting Heart Rate:</h2>
                    <p style="margin: 0; font-size: 1rem;">${viewModel.restingHeartRate}</p>
                </div>
                <div style="margin-right:5vw; display: flex; flex-direction: column;">
                    <div style="display: flex; justify-content: space-between">
                        <button style="width: 47%" type="button" class="btn btn-secondary" @click=${calibrateButtonClicked}>Calibrate
                        </button>
                        <button style="width: 47%" type="button" class="btn btn-secondary" @click=${resetButtonClicked}>Reset
                        </button>
                   </div>
                    <input type="range" style="margin-top: 2%" class="form-range" min="0" max="100" step="1" value="50" @change=${sliderChanged}>
                    <div style="display: flex; justify-content: space-between">
                        <p>Easy</p>
                        <p>Hard</p>
                    </div>
                </div>
            </div>

            ${viewModel.isAboveMax ? html`
                <img style="width: 100vw; height: 100vh; opacity: 0.6; top: 0; left 0; position: absolute; "
                     src="https://raw.githubusercontent.com/Stenz123/hearbeat-jumpscare/refs/heads/master/frontend/src/assets/lobster.jpg">
                <audio style="display: none" controls autoplay
                       src="https://github.com/Stenz123/hearbeat-jumpscare/raw/refs/heads/master/frontend/src/assets/lobster.mp3">
            ` : ""}
        </div>
    `;
}



customElements.define("app-component", AppComponent);