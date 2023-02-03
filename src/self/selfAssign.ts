/* eslint-disable no-global-assign */
(() => {
  typeof self == 'undefined' &&
    global &&
    typeof global == 'object' &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (global.self = global) &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (global.window = global) &&
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (self = global);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  typeof self == 'undefined' && (self = {});
})();
export {};
