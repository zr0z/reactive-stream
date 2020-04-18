import Stream from "../src/reactive-stream.js";
import merge from "../web_modules/mergerino.js";
import { html, render } from "../web_modules/lit-html.js";

// States
var convert = (value, to) =>
  Math.round(to === "C" ? ((value - 32) / 9) * 5 : (value * 9) / 5 + 32);

const temperature = {
  initial: (label) => ({
    label,
    value: 22,
    units: "C",
  }),
  Actions: (update) => ({
    increment(id, amount) {
      update({
        [id]: {
          value: (x) => x + amount,
        },
      });
    },
    changeUnits(id) {
      update({
        [id]: ({ label, value, units }) => ({
          label,
          value: convert(value, (units = units === "C" ? "F" : "C")),
          units,
        }),
      });
    },
  }),
};

const conditions = {
  initial: {
    conditions: {
      precipitations: false,
      sky: "Sunny",
    },
  },
  Actions: (update) => ({
    togglePrecipitations(id, value) {
      update({ [id]: { precipitations: value } });
    },
    changeSky(id, value) {
      update({ [id]: { sky: value } });
    },
  }),
};
console.log("debug", temperature.initial("Air"));

// Multiple components grouped in an app
const app = {
  initial: {
    ...conditions.initial,
    "temperature:air": temperature.initial("Air"),
    "temperature:water": temperature.initial("Water"),
  },
  Actions: (update) => ({
    ...conditions.Actions(update),
    ...temperature.Actions(update),
  }),
};

const update = Stream();
const states = update.scan(merge, app.initial);
const actions = app.Actions(update);

// Views

// Condition components
const skyOption = ({ state, id, actions, value, label }) => html`<label>
  <input
    type="radio"
    id=${value}
    name="sky"
    value=${value}
    .checked=${state[id].sky === value}
    @change=${(evt) => actions.changeSky(id, evt.target.value)}
  />
  ${label}
</label>`;

const Conditions = ({ state, id, actions }) => html`<div>
  <label>
    <input
      type="checkbox"
      .checked=${state[id].precipitations}
      @change=${(evt) => actions.togglePrecipitations(id, evt.target.checked)}
    />
    Precipitations
  </label>
  <div>
    ${skyOption({ state, id, actions, value: "SUNNY", label: "Sunny" })}
    ${skyOption({ state, id, actions, value: "CLOUDY", label: "Cloudy" })}
    ${skyOption({
      state,
      id,
      actions,
      value: "MIX",
      label: "Mix of sun/clouds",
    })}
  </div>
</div>`;

// Temparture components
const Temperature = ({ state, id, actions }) => html`<div>
  ${state[id].label} Temperature: ${state[id].value} &deg; ${state[id].units}
  <div>
    <button @click=${() => actions.increment(id, 1)}>
      Increment
    </button>
    <button @click=${() => actions.increment(id, -1)}>
      Decrement
    </button>
  </div>
  <div>
    <button @click=${() => actions.changeUnits(id)}>
      Change Units
    </button>
  </div>
</div>`;

// Application
const App = (state, actions) => html`<div>
  ${Conditions({ state, id: "conditions", actions })}
  ${Temperature({ state, id: "temperature:air", actions })}
  ${Temperature({ state, id: "temperature:water", actions })}
  <pre>${JSON.stringify(state, null, 4)}</pre>
</div>`;

// Bootstrap the Application
var element = document.getElementById("app");
states.map((state) => render(App(state, actions), element));
