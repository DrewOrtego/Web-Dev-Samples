var map, locator;

require([
    "esri/map",
    "esri/tasks/locator",
    "esri/graphic",
    "esri/dijit/BasemapToggle",
    "esri/InfoTemplate",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/Font",
    "esri/symbols/TextSymbol",
    "dojo/_base/array",
    "esri/Color",
    "dojo/number",
    "dojo/parser",
    "dojo/dom",
    "dijit/registry",
    "dijit/form/Button",
    "dijit/form/Textarea",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dojo/domReady!",
    "http://andrewo.esri.com/test/ToDo.js",
], function(
    Map,
    Locator,
    Graphic,
    BasemapToggle,
    InfoTemplate,
    SimpleMarkerSymbol,
    Font,
    TextSymbol,
    arrayUtils,
    Color,
    number, 
    parser,
    dom,
    registry
) {
    parser.parse();

    map = new Map("map", {
        basemap: "streets",
        center: [-93.5, 41.431],
        zoom: 5
    });

    var toggle = new BasemapToggle({
        map: map,
        basemap: "satellite"
      }, "BasemapToggle");
      toggle.startup();

    locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    locator.on("address-to-locations-complete", showResults);
    map.infoWindow.resize(200, 125);
    
    function showResults(evt) {
        var symbol = new SimpleMarkerSymbol();
        var infoTemplate = new InfoTemplate(
            "Location",
            "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}"
        );
        symbol.setStyle(SimpleMarkerSymbol.STYLE_SQUARE);
        symbol.setColor(new Color([153, 0, 51, 0.75]));

        var geom;
        arrayUtils.every(evt.addresses, function(candidate) {
            console.log(candidate.score);
            if (candidate.score > 80) {
                console.log(candidate.location);
                var attributes = {
                    address: candidate.address,
                    score: candidate.score,
                    locatorName: candidate.attributes.Loc_name
                };
                geom = candidate.location;
                var graphic = new Graphic(geom, symbol, attributes, infoTemplate);
                //add a graphic to the map at the geocoded location
                map.graphics.add(graphic);
                //add a text symbol to the map listing the location of the matched address.
                var displayText = candidate.address;
                var font = new Font(
                    "16pt",
                    Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL,
                    Font.WEIGHT_BOLD,
                    "Helvetica"
                );

                var textSymbol = new TextSymbol(
                    displayText,
                    font,
                    new Color("#666633")
                );
                textSymbol.setOffset(0, 8);
                map.graphics.add(new Graphic(geom, textSymbol));
                return false; //break out of loop after one candidate with score greater  than 80 is found.
            }
        });
        if (geom !== undefined) {
            map.centerAndZoom(geom, 12);
        }
    }
});