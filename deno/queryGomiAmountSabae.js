import { ODP } from "https://code4fukui.github.io/SPARQL/ODP.js";
import { rdf2json } from "./rdf2json.js";

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
  //console.log(res.results.bindings, res.results.bindings.length);
  const res2 = rdf2json(res);
  res2.sort((a, b) => a.date.localeCompare(b.date));
  return res2;
};
