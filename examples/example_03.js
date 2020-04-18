import Stream from "../src/reactive-stream.js";

const app = {
  initial: {
    value: 0,
  },
  Actions: (update) => {
    return {
      increment() {
        update(1);
      },
      decrement() {
        update(-1);
      },
    };
  },
};

const update = Stream();
var states = update.scan((state, increment) => {
  state.value = state.value + increment;
  return state;
}, app.initial);

const actions = app.Actions(update);

states.map(function (state) {
  console.log(JSON.stringify(state));
});

actions.increment();
actions.decrement();
