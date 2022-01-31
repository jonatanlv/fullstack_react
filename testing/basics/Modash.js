function truncate(s, l) {
  if (s.length > l) {
    return s.slice(0, l) + "...";
  } else {
    return s;
  }
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function camelCase(s) {
  const words = s.split(/[\s|\-|_]+/);
  return [
    words[0].toLowerCase(),
    ...words.slice(1).map((w) => capitalize(w)),
  ].join("");
}

const Modash = { truncate, capitalize, camelCase };

export default Modash;
