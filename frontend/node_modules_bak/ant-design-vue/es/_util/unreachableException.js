export default class UnreachableException {
  constructor(value) {
    this.error = new Error(`unreachable case: ${JSON.stringify(value)}`);
  }
}