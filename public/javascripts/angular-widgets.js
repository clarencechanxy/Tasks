
// jQuery UI autocomplete
angular.widget('@ui:autocomplete', function(expr, el, val) {
	var compiler = this;
	return function(el) {
	$(el).autocomplete({source:'/tasks/employees'});




	};
});

// jQuery UI datepicker

angular.widget('@ui:datepicker', function(expr, el, val) {
	var compiler = this;
	return function(el) {
		var currentScope = this;
		var dateAttr = $(el).attr('ui:date');
		var options = getOptions(el);
		var defaults = {dateFormat:'dd-mm-yy'};
		var functions = {
			onClose: function(date, ui)
		{
			var dt = $(el).datepicker('getDate');
			currentScope.$set(dateAttr, dt);
			currentScope.$parent.$eval();
		},
		onSelect: function(date, ui)
		{
			var dt = $(el).datepicker('getDate');
			currentScope.$set(dateAttr, dt);
			currentScope.$parent.$eval();
		}
		};
		$.extend(defaults, options, functions);
		$(el).datepicker(defaults);

		currentScope.$watch(dateAttr, function(val) {
		  if(val && val instanceof Date)
		  	$(el).datepicker('setDate',val); 
		}, null, true);
	};
});

angular.widget('@ng:autocomplete', function(expr, el, val) {
  var compiler = this;
  return function(el) {
    var currentScope = this;
    var name = $(el).attr('name');
  };
});

// Google Maps API v. 3.5

angular.widget('ui:map', function(el) {
  var compiler = this;
  var elem = el;
  var pin = $(el).attr('ui:pin');
  var view = $(el).attr('ui:view');
  var options = getOptions(el);
  var defaults = {bindZoom : false, bindMapType: false, center: {lat:0, lng:0}, map: {zoom : 4, mapTypeId : google.maps.MapTypeId.ROADMAP}};
  $.extend(defaults, options);
  defaults.map.center = new google.maps.LatLng(defaults.center.lat, defaults.center.lng);
  return function(el) {
    var currentScope = this;
    $(elem).append('<div/>')
    var div = ('div', elem).get(0);
	var map = new google.maps.Map(div,defaults.map);	
	var marker = new google.maps.Marker({ position: map.center, map: map});
	marker.setDraggable(true);
	google.maps.event.addListener(map, 'click', function(e) {
		marker.setPosition(e.latLng);
		marker.setVisible(true);
		var o = currentScope.$get(pin);
		if(!o) 
			o={};
		$.extend(o, {lat:e.latLng.lat(), lng:e.latLng.lng()});
		currentScope.$set(pin, o);
		currentScope.$parent.$eval();
	});
  		google.maps.event.addListener(marker, 'dragend', function(e) {
  			var o = currentScope.$get(pin);
  			if(!o) 
  				o={};
			$.extend(o, {lat:e.latLng.lat(), lng:e.latLng.lng()});
			currentScope.$set(pin, o);
    		currentScope.$parent.$eval();
  		});
  		google.maps.event.addListener(map, 'dragend', function() {
			var c = map.getCenter();
  			var o = currentScope.$get(view);
  			if(!o) 
  				o={};
			$.extend(o, {lat:c.lat(), lng:c.lng(),});
			currentScope.$set(view, o);
    		currentScope.$parent.$eval();
  		});
  		if(defaults.bindZoom)
	  		google.maps.event.addListener(map, 'zoom_changed', function() {
				var c = map.getCenter();
				var z = map.getZoom();
	  			var o = currentScope.$get(view);
	  			if(!o) 
	  				o={};
				$.extend(o, {lat:c.lat(), lng:c.lng(), zoom:z});
				currentScope.$set(view, o);
	    		currentScope.$parent.$eval();
	  		});
	  	if(defaults.bindMapType)
	  		google.maps.event.addListener(map, 'maptypeid_changed', function() {
				var t = map.getMapTypeId();
	  			var o = currentScope.$get(view);
	  			if(!o) 
	  				o={};
				$.extend(o, {mapType: t});
				currentScope.$set(view, o);
	    		currentScope.$parent.$eval();
	  		});  	    
		$(elem).data('map',map);
		$(elem).data('marker',marker);  
    
    currentScope.$watch(pin + '.lat', function() {
		var map = $(elem).data('map');
		var marker = $(elem).data('marker');
		var newPos = currentScope.$get(pin);
		if(!newPos || !newPos.lat || !newPos.lng){
			marker.setVisible(false);
			return;
		}
      	marker.setPosition(new google.maps.LatLng(newPos.lat, newPos.lng));
	   	marker.setVisible(true);  

    }, null, true);
    
    currentScope.$watch(pin + '.lng', function() {
		var map = $(elem).data('map');
		var marker = $(elem).data('marker');
		var newPos = currentScope.$get(pin);
		if(!newPos || !newPos.lat || !newPos.lng){
			marker.setVisible(false);
			return;
		}
      	marker.setPosition(new google.maps.LatLng(newPos.lat, newPos.lng));
	   	marker.setVisible(true);  

    }, null, true);
    
    currentScope.$watch(view + '.lng', function() {
		var map = $(elem).data('map');
		var newPos = currentScope.$get(view);
		if(newPos)
			map.setCenter(new google.maps.LatLng(newPos.lat, newPos.lng));
    }, null, true);
    
    currentScope.$watch(view + '.lat', function() {
		var map = $(elem).data('map');
		var newPos = currentScope.$get(view);
		if(newPos)
			map.setCenter(new google.maps.LatLng(newPos.lat, newPos.lng));
    }, null, true);
    
    if(defaults.bindMapType)
	    currentScope.$watch(view + '.mapType', function(val) {
			var map = $(elem).data('map');
	      	if(val)
	      		map.setMapTypeId(val);
	    }, null, true);
    
    if(defaults.bindZoom)
	    currentScope.$watch(view + '.zoom', function(val) {
			var map = $(elem).data('map');
	      	if(val)
	      		map.setZoom(val);
	    }, null, true);
    
  };
});



function getOptions(el, attr)
{
	attr = attr || 'ui:options';
	var opts = $(el).attr(attr);
	if(!opts)
		return null;
	return angular.fromJson('['+opts+']')[0];	
}


