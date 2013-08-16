function GRServeur(base_url) {
	this.base_url = base_url;
	this.dossier = null;
	this.image = null;
}

GRServeur.prototype.query = function (args) {
	var params = {
		url: this.base_url+'?'+args,
		async: false,
		dataType: 'json'
	};
	var xhr = jQuery.ajax(params);
	console.log(params);
	console.log(xhr);
	return xhr.responseJSON;
};

GRServeur.prototype.dossiers = function () {
	return this.query("action=dossiers");
};

GRServeur.prototype.images = function (dossier) {
	return this.query("action=images&dossier="+dossier);
};

GRServeur.prototype.points = function (img) {
	return this.query("action=points&img="+img);
};

GRServeur.prototype.url_img = function (img) {
	return this.base_url+"?action=image&img="+img;
};

GRServeur.prototype.point_enregistre = function (img, point) {
	var q = "action=point_enregistre&img="+img;
	q += "&mapX="+point.mapX;
	q += "&mapY="+point.mapY;
	q += "&pixelX="+point.pixelX;
	q += "&pixelY="+point.pixelY;
	q += "&enable="+point.enable;
	return this.query(q);
};
