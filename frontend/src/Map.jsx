import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

function Map({ onPolygonCreated, sites = [] }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [77.5946, 12.9716],
      zoom: 10,
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true,
      },
    });

    map.addControl(draw, "top-left");

    map.on("draw.create", (event) => {
      const polygon = event.features[0];

      console.log("Polygon created:", polygon.geometry);

      onPolygonCreated(polygon.geometry);
    });

    map.on("load", () => {
  if (sites.length === 0) return;

  const features = sites
    .filter((site) => site.geometry)
    .map((site) => ({
      type: "Feature",
      properties: {
        id: site.id,
        name: site.name,
        area: site.area_hectares,
      },
      geometry: site.geometry,
    }));

  if (features.length === 0) return;

  const bounds = new mapboxgl.LngLatBounds();

features.forEach((feature) => {
  feature.geometry.coordinates[0].forEach((coordinate) => {
    bounds.extend(coordinate);
  });
});

map.fitBounds(bounds, {
  padding: 60,
  maxZoom: 14,
});

  map.addSource("saved-sites", {
    type: "geojson",
    data: {
      type: "FeatureCollection",
      features,
    },
  });

  map.addLayer({
    id: "saved-sites-fill",
    type: "fill",
    source: "saved-sites",
    paint: {
      "fill-opacity": 0.35,
    },
  });

  map.addLayer({
    id: "saved-sites-outline",
    type: "line",
    source: "saved-sites",
    paint: {
      "line-width": 3,
    },
  });

  map.on("click", "saved-sites-fill", (event) => {
    const feature = event.features[0];

    new mapboxgl.Popup()
      .setLngLat(event.lngLat)
      .setHTML(
        `<strong>${feature.properties.name}</strong><br/>
         Area: ${feature.properties.area} ha`
      )
      .addTo(map);
  });

  map.on("mouseenter", "saved-sites-fill", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "saved-sites-fill", () => {
    map.getCanvas().style.cursor = "";
  });
});

    return () => map.remove();
  }, [onPolygonCreated, sites]);

  return <div ref={mapContainer} className="map" />;
}

export default Map;