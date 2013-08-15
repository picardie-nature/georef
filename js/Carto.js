Carto.prototype.GRinit = function () {
	this.__GRLayer = new OpenLayers.Layer.Vector("points");
	this.map.addLayer(this.__GRLayer);
}


Carto.prototype.aff_points = function (points) {
	for (var i=0; i<points.length; i++) {
		var pt = new GRPoint(points[i]);
		var proj_from = new OpenLayers.Projection("EPSG:2154");
		this.__GRLayer.addFeatures([pt.OLFeature(proj_from, this.map.getProjection())]);
	}
}
