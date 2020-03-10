export default class Foreground {
  static run() {
    document.addEventListener("click", (event) => {
      console.debug(event);
      debugger;
    }, false);
  }
}
