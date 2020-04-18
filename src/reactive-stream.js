// Reactive Streams
const Stream = () => {
  const sequence = [];
  const observers = [];

  /**
   * Register an observer on the current stream.
   *
   * @param {Function} observer Function that accept the last value added to the stream.
   * @return {Number} Number of observers registered
   */
  const register = (observer) =>
    typeof observer === "function" && observers.push(observer);

  /**
   * Notify all the observers registered on the stream with the value passsed.
   *
   * @param {Any} value Value notified to each registered observer.
   */
  const notify = (value) => observers.map((observer) => observer(value));

  /**
   * Push the value on the sequence and notify the observers.
   *
   * @param {Any} value Value added to the sequence
   */
  const push = (value) => sequence.push(value) && notify(value);

  /**
   * Stream entry point, the observable either accept a new
   * value to push on the stream, or return the last value
   * added if called without parameters.
   *
   * @param {Any?} value Optional value that will be added to the stream
   * @return {Any} The last value added
   */
  const observable = (value) => {
    if (typeof value !== "undefined") {
      push(value);
    }
    return sequence[sequence.length - 1];
  };

  /**
   * Lazy map
   *
   * Lazily apply fn every time a value is added to the source stream,
   * that computed value is added to the dependant stream created
   * when map is called.
   *
   * @param {Function} fn Function applied on each change
   * @return {Stream} the new stream
   */
  observable.map = (fn) => {
    const stream = Stream();
    const iter = (value) => stream(fn(value));

    sequence.map(iter);
    register(iter);

    return stream;
  };

  /**
   * Accumulator
   *
   * Lazily apply fn with the latest value of this stream and the incoming value
   * of the source stream. The result returned by the accumulator
   * is the next value of this child stream.
   *
   * @param {Function} fn Function applied on each change
   * @param {Any} initial Initial value
   * @return {Stream} the new stream
   */
  observable.scan = (fn, initial) => {
    const stream = Stream();
    stream(initial);

    register((value) => stream(fn(stream(), value)));

    return stream;
  };

  return observable;
};

export default Stream;
