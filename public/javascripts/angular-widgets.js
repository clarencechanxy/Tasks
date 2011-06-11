// progress bar
angular.widget('ui:progress', function(el) {
	var compiler = this;
	var defaults = {minValue:0, maxValue:100, showText:true, minColor: '#cccccc', maxColor: '#1aad0c'};
	var options = widgetUtils.getOptions(el, defaults);
	var valueExpr = widgetUtils.parseAttrExpr(el,'ui:value');
	return function(el) {
		var currentScope = this;
		var d1 = $('<div class="progress-body"/>');
		$(el).append(d1);
		var d2 = $('<div class="progress-bar"/>');
		$(d1).append(d2);
		if(options.showText){
			var d3 = $('<div class="progress-text"/>');
			$(d1).append(d3);
		}
		currentScope.$watch(valueExpr.expression, function(val) {

			var v = parseFloat(widgetUtils.formatValue(val, valueExpr)), r0 = parseFloat(options.minValue), r1=parseFloat(options.maxValue);
			var perc = Math.round(Math.min((v - r0) / (r1 - r0), r1) * 100);
			$(d3).html(perc+'%');
			$(d2).css('width',perc+'%');
			if($.xcolor){
				var c = $.xcolor.gradientlevel(options.minColor, options.maxColor, perc, 100);
				(d2).css('background-color',c.getCSS());
			}
		}, null, true);
	};
});


// emblem
angular.widget('ui:emblem', function(el) {
	var compiler = this;
	var defaults = {emblems:['','star','excl']};
	var options = widgetUtils.getOptions(el, defaults);
	return function(el) {
		var currentScope = this;
		var d1 = $('<div class="emblem emblem-empty"/>').click(function(){
			var s0 = $(el).data('symbol');
			var i;
			if(!s0)
				i=0;
			else	
				i = _(options.emblems).indexOf(s0);
			i++
			if(i>options.emblems.length-1)
				i=0;
			var emblem = options.emblems[i];
			$(d1).removeClass('emblem-'+s0).addClass('emblem-'+emblem);	
			$(el).data('symbol',emblem);
			currentScope.$set(symbolAttr, emblem);
		});
		$(el).append(d1);
		var symbolAttr = $(el).attr('ui:symbol');
		currentScope.$watch(symbolAttr, function(val) {
			var s0 = $(el).data('symbol');
			$(el).data('symbol',val);
			$(d1).removeClass('emblem-'+s0).addClass('emblem-'+val);
		}, null, true);
	};
});

// jQuery UI autocomplete
angular.widget('@ui:autocomplete', function(expr, el, val) {
	if(!$.autocomplete)
		return;
	var compiler = this;
	var defaults = {};
	var options = widgetUtils.getOptions(el, defaults);
	return function(el) {
	$(el).autocomplete({source:'/tasks/employees'});




	};
});

// jQuery UI datepicker
angular.widget('@ui:datepicker', function(expr, el, val) {
	if(!$.datepicker)
		return;
	var compiler = this;
	var defaults = {dateFormat:'dd-mm-yy'};
	var options = widgetUtils.getOptions(el, defaults);
	return function(el) {
		var currentScope = this;
		var dateExpr = widgetUtils.parseAttrExpr(el,'ui:date');
		var functions = {
			onClose: function(date, ui)
			{
				var dt = $(el).datepicker('getDate');
				widgetUtils.setValue(currentScope, dateExpr, dt);
			},
			onSelect: function(date, ui)
			{
				var dt = $(el).datepicker('getDate');
				widgetUtils.setValue(currentScope, dateExpr, dt);
			}
		};
		$.extend(defaults, options, functions);
		$(el).datepicker(defaults);

		currentScope.$watch(dateExpr.expression, function(val) {
		  if(val && val instanceof Date)
		  	$(el).datepicker('setDate', widgetUtils.formatValue(val, dateExpr)); 
		}, null, true);
	};
});


// Google Maps API v. 3.5
angular.widget('ui:map', function(el) {
	if(!google || !google.maps)
		return;
	var compiler = this;
	var elem = el;
	var pin = $(el).attr('ui:pin');
	var view = $(el).attr('ui:view');
	var defaults = {bindZoom : false, bindMapType: false, center: {lat:0, lng:0}, map: {zoom : 4, mapTypeId : google.maps.MapTypeId.ROADMAP}};
	var options = widgetUtils.getOptions(el, defaults);
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
			var o = currentScope.$get(pin) || {};
			$.extend(o, {lat:e.latLng.lat(), lng:e.latLng.lng()});
			currentScope.$set(pin, o);
			currentScope.$parent.$eval();
		});
  	
  	google.maps.event.addListener(marker, 'dragend', function(e) {
			var o = currentScope.$get(pin) || {};
			$.extend(o, {lat:e.latLng.lat(), lng:e.latLng.lng()});
			currentScope.$set(pin, o);
    	currentScope.$parent.$eval();
  	});
  	
  	google.maps.event.addListener(map, 'dragend', function() {
			var c = map.getCenter();
  		var o = currentScope.$get(view) || {};
			$.extend(o, {lat:c.lat(), lng:c.lng(),});
			currentScope.$set(view, o);
    	currentScope.$parent.$eval();
  	});

  	if(defaults.bindZoom)
			google.maps.event.addListener(map, 'zoom_changed', function() {
				var c = map.getCenter();
				var z = map.getZoom();
				var o = currentScope.$get(view) || {};
				$.extend(o, {lat:c.lat(), lng:c.lng(), zoom:z});
				currentScope.$set(view, o);
				currentScope.$parent.$eval();
			});

	  if(defaults.bindMapType)
	  	google.maps.event.addListener(map, 'maptypeid_changed', function() {
				var t = map.getMapTypeId();
  			var o = currentScope.$get(view) || {}; 
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



var widgetUtils = {
	getOptions : function (el, defaults, attrName){
		attrName = attrName || 'ui:options';
		var opts = $(el).attr(attrName);
		defaults = defaults || {};
		if(!opts)
			return defaults;
		var options = angular.fromJson('['+opts+']')[0];	
		return $.extend(defaults, options);
	},
	parseAttrExpr: function (el, attrName){
		var attr = $(el).attr(attrName);
		var expr = {formatters:[]};
		var pts = attr.split('|');
		expr.expression = pts[0];
		if(pts.length==1)
			return expr;
		for (var i = 0; i < pts.length; i++){
			var args = pts[i].split(':');
			var name = args.shift();
			var frmt = angular.formatter[name];
			if(frmt)
				expr.formatters.push({name: name, parse: frmt.parse, format: frmt.format, arguments: args});
		}
		return expr;	
	},
	setValue: function (scope, attrExpr, value){
		if(!attrExpr || !attrExpr.expression)
			return;
		var v = value;
		v = this.parseValue(v, attrExpr);	
		scope.$set(attrExpr.expression, v);
		scope.$parent.$eval();	
	},
	getValue: function (scope, attrExpr){
		if(!attrExpr || !attrExpr.expression)
			return null;
		var val = scope.$get(attrExpr.expression);
		val = this.formatValue(val, attrExpr);
		return val;
	},
	parseValue: function (value, attrExpr){
		if(!attrExpr || !attrExpr.formatters || attrExpr.formatters.length==0)
			return value;
		var v = value;	
		for (var i = 0; i < attrExpr.formatters.length; i++) {
			var fm = attrExpr.formatters[i];
			if(fm && fm.parse)
				v = fm.parse.apply(v, [v].concat(fm.arguments));
		};
		return v;	
	},
	formatValue: function (value, attrExpr){
		if(!attrExpr || !attrExpr.formatters || attrExpr.formatters.length==0)
			return value;
		var v = value;	
		for (var i = 0; i < attrExpr.formatters.length; i++) {
			var fm = attrExpr.formatters[i];
			if(fm && fm.format)
				v = fm.format.apply(v, [v].concat(fm.arguments));
		};
		return v;
	}
};
