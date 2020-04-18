import Stream from "../src/reactive-stream.js";
import merge from "../web_modules/mergerino.js";

var convert = (value, to) =>
  Math.round(to === "C" ? ((value - 32) / 9) * 5 : (value * 9) / 5 + 32);

const temperature = {
  initial: {
    value: 22,
    units: "C",
  },
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
        [id]: ({ value, units }) => ({
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

// Multiple components grouped in an app
const app = {
  initial: {
    ...conditions.initial,
    "temperature:air": temperature.initial,
    "temperature:water": temperature.initial,
  },
  Actions: (update) => ({
    ...conditions.Actions(update),
    ...temperature.Actions(update),
  }),
};

const update = Stream();
const states = update.scan(merge, app.initial);
const actions = app.Actions(update);

states.map((state) => console.log(JSON.stringify(state, null, 2)));

actions.increment("temperature:air", 2);
actions.changeUnits("temperature:air");
actions.increment("temperature:water", 5);
actions.changeUnits("temperature:water");
actions.changeSky("conditions", "rainy");
actions.togglePrecipitations("conditions", true);
