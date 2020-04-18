import Stream from "../src/reactive-stream.js";
import merge from "../web_modules/mergerino.js";

var convert = (value, to) =>
  Math.round(to === "C" ? ((value - 32) / 9) * 5 : (value * 9) / 5 + 32);

const temperature = {
  initial: {
    temperature: {
      value: 22,
      units: "C",
    },
  },
  Actions: (update) => ({
    increment(amount) {
      update({
        temperature: {
          value: (x) => x + amount,
        },
      });
    },
    changeUnits() {
      update({
        temperature: ({ value, units }) => ({
          value: convert(value, (units = units === "C" ? "F" : "C")),
          units,
        }),
      });
    },
  }),
};

const update = Stream();
const states = update.scan(merge, temperature.initial);
const actions = temperature.Actions(update);

states.map((state) => console.log(JSON.stringify(state, null, 2)));

actions.increment(2);
actions.changeUnits();
