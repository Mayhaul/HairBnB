import * as maptilersdk from "@maptiler/sdk";
import { GeocodingControl } from "@maptiler/geocoding-control/maptilersdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";


maptilersdk.config.apiKey = window.MAP_API_KEY;

const map = new maptilersdk.Map({
  container: "map", // id of HTML container element
});

const gc = new GeocodingControl();

map.addControl(gc);