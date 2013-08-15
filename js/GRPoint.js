function GRPoint(point) {
	this.data = point;
	this.mapX = point[0];
	this.mapY = point[1];
	this.pixelX = point[2];
	this.pixelY = point[3];
	this.enable = point[4];
}

GRPoint.prototype.OLFeature = function (proj_from, proj_to) {
	var geom = new OpenLayers.Geometry.Point(this.mapX, this.mapY);
	if (proj_from != proj_to) {
		var lonlat = new OpenLayers.LonLat(this.mapX, this.mapY);
		var ll = lonlat.transform(proj_from, proj_to);
		geom = new OpenLayers.Geometry.Point(ll.lon, ll.lat);
	}
	return new OpenLayers.Feature.Vector(geom, this.data);
}
