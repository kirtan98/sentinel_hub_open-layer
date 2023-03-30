var vectorsource = new ol.source.Vector({wrapX: false});

var vectorlayer = new ol.layer.Vector({
  source: vectorsource
});

var osm = new ol.layer.Tile({
    source: new ol.source.OSM()
})

var map = new ol.Map({
    target: 'map',
    view: new ol.View({
        zoom: 8,
        center: [8076488.327293, 2659225.151755]
    })
});  

var draw = new ol.interaction.Draw({
    source: vectorsource,
    type: 'Polygon'
});

map.addInteraction(draw);

var polygon, bbox, NDVILAYER, startdate, enddate;
draw.on('drawend', function(event) {
    var feature = event.feature;
    polygon = feature.getGeometry().getExtent();
});

function ndvilayer() {
    startdate = document.getElementById('startdate').value;
    enddate = document.getElementById('enddate').value;

    // Define Sentinel Hub WMS parameters
    var SHUB_INSTANCE_ID = "Enter ID";
    var SHUB_LAYER = "Layer Name";
    var SHUB_MAXCC = 20;
    var SHUB_PARAMS = {
        "LAYERS": SHUB_LAYER,
        "FORMAT": "image/png",
        "TRANSPARENT": true,
        "MAXCC": SHUB_MAXCC,
        "BBOX": polygon.join(','),
        "TIME":  startdate + '/' + enddate,
        "TILE": true,
      };

      NDVILAYER = new ol.layer.Tile({
        source: new ol.source.TileWMS({
        url: `https://services.sentinel-hub.com/ogc/wms/${SHUB_INSTANCE_ID}`,
        params: SHUB_PARAMS
    }),
    opacity: 1,
    title: "Sentinel_NDVI"
});

map.addLayer(NDVILAYER);

}

function reset(){
    map.removeLayer(NDVILAYER);
    map.getView().setZoom(8);
    map.getView().setCenter([8076488.327293, 2659225.151755]);
}

map.addLayer(osm)
map.addLayer(vectorlayer);