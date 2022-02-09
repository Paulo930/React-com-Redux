function getLocalStorage(key, initial) {
  try {
    return JSON.parse(window.getLocalStorage(key));
  } catch (error) {
    return initial;
  }
}

export default getLocalStorage;
