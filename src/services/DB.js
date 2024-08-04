import { CookieStore } from "./CookieStore";

export function DB(persist) {
  // session storage or more permaneny local storage
  try {
    window.localStorage.setItem("replicated.vendor.test", "test");
    window.localStorage.removeItem("replicated.vendor.test");
    this.store = persist ? window.localStorage : window.sessionStorage;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (exc) {
    // private browsing?
    this.store = CookieStore;
  }
}

DB.prototype.getItem = function (key) {
  return this.store.getItem(key);
};

DB.prototype.setItem = function (key, value) {
  return this.store.setItem(key, value);
};

DB.prototype.removeItem = function (key) {
  return this.store.removeItem(key);
};

DB.prototype.clear = function () {
  window.localStorage.removeItem("replicated.vendor.sessionid");
  window.localStorage.removeItem("replicated.vendor.data");
  window.localStorage.clear();
  window.sessionStorage.removeItem("replicated.vendor.sessionid");
  window.sessionStorage.removeItem("replicated.vendor.data");
  window.sessionStorage.clear();
  CookieStore.removeItem("replicated.vendor.sessionid");
  CookieStore.removeItem("replicated.vendor.data");
};
