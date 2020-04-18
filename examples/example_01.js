import Stream from "../src/reactive-stream.js";

const stream = Stream();

stream(1);

const timesTen = stream.map((v) => v * 10);
const plusTwo = timesTen.map((v) => v + 2);
plusTwo.map(console.log);

stream(2);
stream(3);
