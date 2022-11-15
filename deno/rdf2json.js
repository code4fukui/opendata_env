export const rdf2json = (res) => {
  const json = [];
  for (const d of res.results.bindings) {
    const o = {};
    for (const name in d) {
      const p = d[name];
      if (p.type == "literal") {
        if (p.datatype == "http://www.w3.org/2001/XMLSchema#date") {
          o[name] = p.value;
        } else if (p.datatype == "http://www.w3.org/2001/XMLSchema#float") {
          o[name] = parseFloat(p.value);
        } else if (p.datatype == "http://www.w3.org/2001/XMLSchema#integer") {
          o[name] = parseInt(p.value);
        } else if (p.datatype == undefined) { // string
          o[name] = p.value;
        }
      } else {
        throw new Error("not supported yet: " + p.type);
      }
    }
    json.push(o);
  }
  return json;
};
