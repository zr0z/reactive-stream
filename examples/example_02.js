import Stream from "../src/reactive-stream.js";

const stream = Stream();
const otherStream = stream.scan((l, n) => l + n, 0);
otherStream.map(console.log);

stream(5);
stream(-3);
stream(8);
stream(2);
