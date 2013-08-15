Carto.prototype.GRinit = function () {
	this.__GRLayer = new OpenLayers.Layer.Vector("points");
	this.map.addLayer(this.__GRLayer);
	this.proj_from = new OpenLayers.Projection("EPSG:2154");
	this.map.events.register("click", this, function(e) {
		var lonlat = this.map.getLonLatFromViewPortPx(e.xy);
		if (document.nouveau_point) {
			lonlat = lonlat.transform(this.map.getProjection(), this.proj_from);
			var point = new GRPoint([lonlat.lon,lonlat.lat,document.nouveau_point.x,document.nouveau_point.y,1]);
			console.log(point);
			//todo: enregistrer sur le serveur distant, afficher sur la carte, ajouter à la liste des points en local
		}
	});
}

Carto.prototype.aff_points = function (points) {
	for (var i=0; i<points.length; i++) {
		var pt = new GRPoint(points[i]);
		this.__GRLayer.addFeatures([pt.OLFeature(this.proj_from, this.map.getProjection())]);
	}
}
