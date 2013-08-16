Carto.prototype.GRinit = function (srv) {
	this.map.__GRSrv = srv;
	this.__GRLayer = new OpenLayers.Layer.Vector("points");
	this.map.addLayer(this.__GRLayer);
	this.proj_from = new OpenLayers.Projection("EPSG:2154");
	this.map.events.register("click", this, function(e) {
		var lonlat = this.map.getLonLatFromViewPortPx(e.xy);
		if (document.nouveau_point != null) {
			if (confirm("Enregistrer nouveau point")) {
				lonlat = lonlat.transform(this.map.getProjection(), this.proj_from);
				var point = new GRPoint([lonlat.lon,lonlat.lat,document.nouveau_point.x,document.nouveau_point.y,1]);
				console.log(point);
				this.map.__GRSrv.point_enregistre(document.image_point,point);
				document.points.push(point);
				this.__GRLayer.addFeatures([point.OLFeature(this.proj_from, this.map.getProjection())]);
				document.nouveau_point = null;
			}
		}
	});
}

Carto.prototype.aff_points = function (points) {
	for (var i=0; i<points.length; i++) {
		var pt = new GRPoint(points[i]);
		this.__GRLayer.addFeatures([pt.OLFeature(this.proj_from, this.map.getProjection())]);
	}
}
