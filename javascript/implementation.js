var map1;
var map2;
var xyLayer = L.TileLayer.extend({
	// continuousWorld を trueにしたいだけ
	options: {
		minZoom: 0,
		maxZoom: 18,
		tileSize: 256,
		subdomains: 'abc',
		errorTileUrl: '',
		attribution: '',
		zoomOffset: 0,
		opacity: 1,
		continuousWorld: true,
		unloadInvisibleTiles: L.Browser.mobile,
		updateWhenIdle: L.Browser.mobile
	},

	// just not to set image styles
	_createTileProto: function() {
		var img = this._tileImg = L.DomUtil.create('img', 'leaflet-tile');
		img.galleryimg = 'no';
	}
});

var myCrs = L.Util.extend({}, L.CRS, {
	code: 'XYMAP:0001',

	projection: {
		project: function(latlng) {
			return new L.Point(latlng.lng / 10, latlng.lat / 10);
		},
		unproject: function(point, unbounded) {
			return new L.LatLng(point.y * 10, point.x * 10, true);
		},
		fromXY2LL:function(point,maxPixelWidth,maxPixelHeight){
			var x_mod = point.x / maxPixelWidth;
			var lng = 10 * x_mod ;
			var y_mod = point.y / maxPixelHeight;
			var lat = 10 *  y_mod ;	
			var rtn = new L.LatLng(lat,lng,true);
			return rtn;
		},
		fromLL2XY:function(ll,maxPixelWidth,maxPixelHeight){
			var rtn = new L.Point(	  
		    (ll.lng / 10) * maxPixelWidth,
		    (ll.lat / 10) * maxPixelHeight);
			return rtn;
		},
	},
	transformation: new L.Transformation(1,0,1,0)
	
});

var myMap = L.Map.extend({
	xy2ll:function(a,b){
		var point;
		if (a instanceof L.Point) {
			point = a;
		}else if (isArray(a)) {
			point = new L.Point(a[0], a[1]);
		}
		return this.options.crs.projection.fromXY2LL(point,this.options.maxPixelSize,this.options.maxPixelSize);
	},
	ll2xy:function(a,b){
		var ll;
		if (a instanceof L.LatLng) {
			ll = a;
		}else if (isArray(a)) {
			ll = new L.LatLng(a[0], a[1]);
		}
		return this.options.crs.projection.fromLL2XY(ll,this.options.maxPixelSize,this.options.maxPixelSize);
	}
});

$(function(){
	set100Pct();
	$(window).resize(function(){
		set100Pct();
	});	

	var baseTileUrl = 'http://{s}.tile.cloudmade.com/77b7b2219a944c3cbf118035611d6dae/997/256/{z}/{x}/{y}.png',
	attribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>';
	var baseLayer = new L.tileLayer(baseTileUrl,{ attribution: attribution});
	map1 = L.map('map1',{minZoom:2,maxZoom:20}).fitBounds([map1SW, map1NE]).addLayer(baseLayer);
	
	var xyMapUrl = "http://t.saesparam.com/edit/e2439add-4002-48e8-805e-7944d553a9bd/e2439add-4002-48e8-805e-7944d553a9bd-{z}_{x}_{y}.png",
	xyMapAttr = 'Hogehoge';
	var xyMapLayer = new xyLayer(xyMapUrl,{minZoom: 0, maxZoom: map2MaxZoom, attribution: xyMapAttr});
	map2 = new myMap('map2',
	{
		crs:myCrs,
		minZoom:0,
		maxZoom:map2MaxZoom,
		maxPixelSize: 256 * (1 << map2MaxZoom)
	}
	);
	map2.addLayer(xyMapLayer);
	map2.fitBounds([map2.xy2ll(map2SW),map2.xy2ll(map2NE)]);
	

});

function isArray(o){
	return	Object.prototype.toString.call(o) === '[object Array]';
}

function set100Pct(){
	var dw = $(window).width();
	var dh = $(window).height();
	$("#main").css({width:dw + "px",height:dh + "px"});
	if (map1){
		map1.invalidateSize();
	}	
	if (map2){
		map2.invalidateSize();
	}	
	
}




