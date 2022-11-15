import { ODP } from "https://code4fukui.github.io/SPARQL/ODP.js";

/*
<odp:RubbishCollectionAmount rdf:about="http://data.city.sabae.lg.jp/rdf/951#2020-05-31+00%3A00%3A00/%E7%87%83%E3%82%84%E3%81%99%E3%81%94%E3%81%BF">
    <odp:refArea rdf:resource="http://data.e-stat.go.jp/lod/sac/C18207"/>
    <odp:refDate rdf:datatype="http://www.w3.org/2001/XMLSchema#date"
    >2020-05-31</odp:refDate>
    <odp:classified>
      <rdf:Description rdf:about="http://odp.jig.jp/res/classified/%E7%87%83%E3%82%84%E3%81%99%E3%81%94%E3%81%BF">
        <rdfs:label>燃やすごみ</rdfs:label>
      </rdf:Description>
    </odp:classified>
    <odp:refArea rdf:resource="http://statdb.nstac.go.jp/lod/sac/C18207"/>
    <odp:weight>
      <odp:ValueWithUnit>
        <odp:unit rdf:resource="http://dbpedia.org/resource/Tonne"/>
        <rdf:value rdf:datatype="http://www.w3.org/2001/XMLSchema#float"
        >1285.56</rdf:value>
      </odp:ValueWithUnit>
    </odp:weight>
  </odp:RubbishCollectionAmount>
  */

const rdf2json = (res) => {
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

export const queryGomiAmountSabae = async () => {
  const sparql = new ODP();
  const res = await sparql.query(`
  select distinct ?date ?type ?amount { graph ?g {
    ?s a <http://odp.jig.jp/odp/1.0#RubbishCollectionAmount>.
    ?s <http://odp.jig.jp/odp/1.0#refArea> <http://data.e-stat.go.jp/lod/sac/C18207>.
    ?s <http://odp.jig.jp/odp/1.0#refDate> ?date.
    ?s <http://odp.jig.jp/odp/1.0#classified> / <http://www.w3.org/2000/01/rdf-schema#label> ?type.
    ?s  <http://odp.jig.jp/odp/1.0#weight> / <http://www.w3.org/1999/02/22-rdf-syntax-ns#value> ?amount.
  } } limit 1000
  `);
  console.log(res.results.bindings, res.results.bindings.length);
  const res2 = rdf2json(res);
  res2.sort((a, b) => a.date.localeCompare(b.date));
  return res2;
};
