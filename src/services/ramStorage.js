const store = {};

export const ramStorage = {
  getItem(key) {
    return store[key];
  },

  clear() {
    store = {};
  },

  removeItem(key) {
    delete store[key];
  },

  getAllKeys() {
    var keys = [];
    for (var i = 0; i < store.length; i++) {
      keys.push(store.key(i));
    }
    return keys;
  },

  setItem(key, val) {
    store[key] = val;
  },
};
