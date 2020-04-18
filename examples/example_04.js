import Stream from "../src/reactive-stream.js";

const convert = (value, to) =>
  Math.round(to === "C" ? ((value - 32) / 9) * 5 : (value * 9) / 5 + 32);

const temperature = {
  initial: {
    temperature: {
      value: 22,
      units: "C",
    },
  },
  Actions: (update) => ({
    increment: (amount) =>
      update(({ temperature: { value, units } }) => ({
        temperature: {
          value: value + amount,
          units,
        },
      })),
    changeUnits: () =>
      update(({ temperature: { value, units } }) => ({
        temperature: {
          value: convert(value, (units = units === "C" ? "F" : "C")),
          units,
        },
      })),
  }),
};

const update = Stream();

const states = update.scan((state, patch) => patch(state), temperature.initial);

const actions = temperature.Actions(update);

states.map((state) => console.log(JSON.stringify(state, null, 2)));

actions.increment(2);
actions.changeUnits();
