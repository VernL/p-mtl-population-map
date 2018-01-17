//add map
const map = L.map('mapid').setView([45.5017, -73.5673], 10);

//add tiles
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
  maxZoom: 18,
}).addTo(map);

//city boundary geojson on a layer, style, and add event listners onEachFeature
geojsonLayer = new L.GeoJSON.AJAX("./limadmin.json",{style:style, onEachFeature: onEachFeature});
geojsonLayer.addTo(map);

const info = L.control();
  info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
  };
  // method that we will use to update the control based on feature properties passed
  info.update = function (props) {
    this._div.innerHTML = '<h4>Montreal Density Map</h4>' +  (props ?
      '<b>' + props.NOM + '</b><br />' + Number((props.POP / props.AIRE) * 1000000).toFixed(1) + ' people / km<sup>2</sup>'
      : 'Hover over an area');
  };
info.addTo(map);

const legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
    let div = L.DomUtil.create('div', 'info legend'),
      grades = [0, 2000, 4000, 6000, 8000, 10000, 12000],
      labels = [];
    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < grades.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
legend.addTo(map);

function style(feature) {
  let density = Number((feature.properties.POP / feature.properties.AIRE) * 1000000).toFixed(1)
  console.log('density', density)
  return {
    fillColor: getColor(density),
    weight: 2,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  };
}

function getColor(d) {
  return d > 12000 ? '#7a0177' :
    d > 10000  ? '#ae017e' :
      d > 8000  ? '#dd3497' :
        d > 6000  ? '#f768a1' :
          d > 4000   ? '#fa9fb5' :
            d > 2000   ? '#fcc5c0' :
            '#fde0dd'
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: zoomToFeature
  });
}

function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  //these browsers are not compatible with bringToFront
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }

  info.update(layer.feature.properties)
}

function resetHighlight(e) {
  geojsonLayer.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

















