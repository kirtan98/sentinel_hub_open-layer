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

var polygon, bbox, nadvi_layer, startdate, enddate;
draw.on('drawend', function(event) {
    var feature = event.feature;
    polygon = feature.getGeometry().getExtent();
});

function ndvilayer() {
    startdate = document.getElementById('startdate').value;
    enddate = document.getElementById('enddate').value;
    
    var SHUB_INSTANCE_ID = "Enter ID"; //As per the API documentation here, I am not mentioning the code because of credentials privacy.  

      nadvi_layer = new ol.layer.Tile({
        source: new ol.source.TileWMS({
        url: `https://services.sentinel-hub.com/ogc/wms/${SHUB_INSTANCE_ID}`,
        params: {
            "LAYERS": "Layer Name",
            "FORMAT": "image/png",
            "TRANSPARENT": true,
            "MAXCC": 10,
            "BBOX": polygon.join(','),
            "TIME":  startdate + '/' + enddate,
            "TILE": true
        }
    }),
    opacity: 1,
    title: "Sentinel_NDVI"
});
map.addLayer(nadvi_layer);
}

function reset(){
    map.removeLayer(nadvi_layer);
    vectorsource.clear();
    map.getView().setZoom(8);
    map.getView().setCenter([8076488.327293, 2659225.151755]);
}

map.addLayer(osm)
map.addLayer(vectorlayer);
