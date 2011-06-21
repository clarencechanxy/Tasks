// progress bar
angular.widget('ui:progress', function(el) {
	var compiler = this;
	var defaults = {minValue: 0, maxValue: 100, showText: true, minColor: '#cccccc', maxColor: '#1aad0c'};
	var options = widgetUtils.getOptions(el, defaults);
	var valueExpr = widgetUtils.parseAttrExpr(el, 'ui:value');
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
			var v = parseFloat(widgetUtils.formatValue(val, valueExpr, currentScope)) || 0, r0 = parseFloat(options.minValue), r1=parseFloat(options.maxValue);
			var perc = Math.max(Math.min(Math.round(Math.min((v - r0) / (r1 - r0), r1) * 100), 100), 0);
			$(d3).html(perc + '%');
			$(d2).css('width', perc+'%');
			if($.xcolor){
				var c = $.xcolor.gradientlevel(options.minColor, options.maxColor, perc, 100);
				(d2).css('background-color', c.getCSS());
			}
		}, null, true);
	};
});


// emblem
angular.widget('ui:emblem', function(el) {
	var compiler = this;
	var defaults = {emblems: ['', 'star', 'excl']};
	var options = widgetUtils.getOptions(el, defaults);
	var symbolExpr = widgetUtils.parseAttrExpr(el, 'ui:symbol');
	return function(el) {
		var currentScope = this;
		var d1 = $('<div class="emblem"/>').click(function(){
			var s0 = $(el).data('symbol');
			var i = 0;
			if(s0)
				i = _(options.emblems).indexOf(s0);
			i++;
			if(i>options.emblems.length-1)
				i=0;
			var emblem = options.emblems[i];
			$(d1).removeClass('emblem-' + s0).addClass('emblem-' + emblem);	
			$(el).data('symbol', emblem);
			widgetUtils.setValue(currentScope, symbolExpr, emblem);
		});
		$(el).append(d1);
		currentScope.$watch(symbolExpr.expression, function(val) {
			var v = widgetUtils.formatValue(val, symbolExpr, currentScope);
			var s0 = $(el).data('symbol');
			$(el).data('symbol', v);
			$(d1).removeClass('emblem-' + s0).addClass('emblem-' + v);
		}, null, true);
	};
});

// jQuery UI autocomplete
angular.widget('@ui:autocomplete', function(expr, el, val) {

	var compiler = this;
	var defaults = {
		renderItem: function(item){ return item.firstName + ' ' + item.lastName;},
		delay: 50,
		highlight: true
	};
	var options = widgetUtils.getOptions(el, defaults);
	var itemExpr = widgetUtils.parseAttrExpr(el, 'ui:item');
	var linkFn = function($xhr, $log, el) {
		var currentScope = this;
		
		var events = {
			source: function(req, res){
				$xhr('GET', options.urls.list + req.term, function(code, response){
					res(response);	
				});
			},
			select: function(event, ui){
				var txt = (options.showItem || options.renderItem)(ui.item);
				$(el).val(txt).blur();
				widgetUtils.setValue(currentScope, itemExpr, ui.item);
				return false;
			},
			focus: function(event, ui){
				var txt = (options.showItem || options.renderItem)(ui.item);
				$(el).val(txt);
			}
		};

		var renderFn = {
			_renderItem: function(ul, item){
				var hl = options.highlight ? (options.highlightFunction || widgetUtils.highlight) : widgetUtils.noHighlight;
				return $('<li></li>')
				.data('item.autocomplete', item)
				.append('<a>' + hl(this.term, options.renderItem(item)) + '</a>')
				.appendTo(ul);
			}
		};

		$.extend(options,events);
		var ac = $(el).autocomplete(options).data('autocomplete');
		$.extend(ac, renderFn);

		currentScope.$watch(itemExpr.expression, function(val){
			var txt = (options.showItem || options.renderItem)(val);
			$(el).val(txt).blur();
		}, null, true);

	};
	linkFn.$inject = ['$xhr', '$log'];
	return linkFn;
});

// jQuery UI datepicker
angular.widget('@ui:datepicker', function(expr, el, val) {
	if(!$.datepicker)
		return;
	var compiler = this;
	var defaults = {dateFormat: 'dd-mm-yy'};
	var options = widgetUtils.getOptions(el, defaults);
	var events = {};
	var dateExpr = widgetUtils.parseAttrExpr(el, 'ui:date');
	return function(el) {
		var currentScope = this
		var tagName = $(el)[0].tagName.toLowerCase();
		if(tagName == 'input' || tagName == 'textarea')
		events.onClose = function(date, ui){
				var dt = $(el).datepicker('getDate');
				widgetUtils.setValue(currentScope, dateExpr, dt);
			};
		else
		events.onSelect = function(date, ui){
				var dt = $(el).datepicker('getDate');
				widgetUtils.setValue(currentScope, dateExpr, dt);
			};
		$.extend(options, events);
		$(el).datepicker(options);
		currentScope.$watch(dateExpr.expression, function(val){
		  if(val && val instanceof Date)
		  	$(el).datepicker('setDate', widgetUtils.formatValue(val, dateExpr, currentScope)); 
		}, null, true);
	};
});


// Google Maps API v. 3.5
angular.widget('ui:map', function(el) {
	if(!google || !google.maps)
		return;
	var compiler = this;
	var elem = el;
	var pinExpr = widgetUtils.parseAttrExpr(el, 'ui:pin');
	var viewExpr = widgetUtils.parseAttrExpr(el, 'ui:view');
	var defaults = {bindZoom : false, bindMapType: false, center: {lat:0, lng:0}, pinDraggable: true, map: {zoom: 4, mapTypeId: google.maps.MapTypeId.ROADMAP}};
	var options = widgetUtils.getOptions(el, defaults);
	defaults.map.center = new google.maps.LatLng(defaults.center.lat, defaults.center.lng);
	return function(el) {
    var currentScope = this;
		$(elem).append('<div/>')
		var div = ('div', elem).get(0);
		var map = new google.maps.Map(div,options.map);	
		var marker = new google.maps.Marker({ position: map.center, map: map});
		marker.setDraggable(options.pinDraggable);
		
		google.maps.event.addListener(map, 'click', function(e) {
			marker.setPosition(e.latLng);
			marker.setVisible(true);
			var o = widgetUtils.getValue(currentScope, pinExpr) || {};
			$.extend(o, {lat:e.latLng.lat(), lng:e.latLng.lng()});
			widgetUtils.setValue(currentScope, pinExpr, o);
		});
  	
  	google.maps.event.addListener(marker, 'dragend', function(e) {
			var o = widgetUtils.getValue(currentScope, pinExpr) || {};
			$.extend(o, {lat: e.latLng.lat(), lng: e.latLng.lng()});
			widgetUtils.setValue(currentScope, pinExpr, o);
  	});
  	
  	google.maps.event.addListener(map, 'dragend', function() {
			var c = map.getCenter();
			var o = widgetUtils.getValue(currentScope, viewExpr) || {};
			$.extend(o, {lat: c.lat(), lng: c.lng()});
			widgetUtils.setValue(currentScope, viewExpr, o);
  	});

  	if(defaults.bindZoom)
			google.maps.event.addListener(map, 'zoom_changed', function() {
				var c = map.getCenter();
				var z = map.getZoom();
				var o = widgetUtils.getValue(currentScope, viewExpr) || {};
				$.extend(o, {lat: c.lat(), lng: c.lng(), zoom: z});
				widgetUtils.setValue(currentScope, viewExpr, o);
			});

	  if(defaults.bindMapType)
	  	google.maps.event.addListener(map, 'maptypeid_changed', function() {
				var t = map.getMapTypeId();	
				var o = widgetUtils.getValue(currentScope, viewExpr) || {};
				$.extend(o, {mapType: t});
				widgetUtils.setValue(currentScope, viewExpr, o);
  		});

		$(elem).data('map', map);
		$(elem).data('marker', marker);  
    
    currentScope.$watch(pinExpr.expression + '.lat', function() {
			var map = $(elem).data('map');
			var marker = $(elem).data('marker');
			var newPos = widgetUtils.getValue(currentScope, pinExpr);
			if(!newPos || !newPos.lat || !newPos.lng){
				marker.setVisible(false);
				return;
			}
			marker.setPosition(new google.maps.LatLng(newPos.lat, newPos.lng));
			marker.setVisible(true);  
    }, null, true);
    
    currentScope.$watch(pinExpr.expression + '.lng', function() {
			var map = $(elem).data('map');
			var marker = $(elem).data('marker');
			var newPos = widgetUtils.getValue(currentScope, pinExpr);
			if(!newPos || !newPos.lat || !newPos.lng){
				marker.setVisible(false);
				return;
			}
			marker.setPosition(new google.maps.LatLng(newPos.lat, newPos.lng));
			marker.setVisible(true);  
    }, null, true);
    
    currentScope.$watch(viewExpr.expression + '.lng', function() {
			var map = $(elem).data('map');
			var newPos = widgetUtils.getValue(currentScope, viewExpr);
			if(newPos)
				map.setCenter(new google.maps.LatLng(newPos.lat, newPos.lng));
    }, null, true);
    
    currentScope.$watch(viewExpr.expression + '.lat', function() {
			var map = $(elem).data('map');
			var newPos = widgetUtils.getValue(currentScope, viewExpr);
			if(newPos)
				map.setCenter(new google.maps.LatLng(newPos.lat, newPos.lng));
    }, null, true);
    
    if(defaults.bindMapType)
	    currentScope.$watch(viewExpr.expression + '.mapType', function(val) {
				var map = $(elem).data('map');
				if(val)
					map.setMapTypeId(val);
	   	}, null, true);
    
    if(defaults.bindZoom)
			currentScope.$watch(viewExpr.expression + '.zoom', function(val) {
				var map = $(elem).data('map');
				if(val)
					map.setZoom(val);
	  	}, null, true);
    
  };
});



var widgetUtils = {
	highlight: function(term, text){
		if(!text)
			return null;
		var rx = new RegExp("("+$.ui.autocomplete.escapeRegex(term)+")", "ig" );
  	return text.replace(rx, "<strong>$1</strong>");
	},
	noHighlight: function(term, text){
		return text;
	},
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
		v = this.parseValue(v, attrExpr, scope);	
		scope.$set(attrExpr.expression, v);
		scope.$parent.$eval();	
	},
	getValue: function (scope, attrExpr){
		if(!attrExpr || !attrExpr.expression)
			return null;
		var val = scope.$get(attrExpr.expression);
		val = this.formatValue(val, attrExpr, scope);
		return val;
	},
	parseValue: function (value, attrExpr, scope){
		if(!attrExpr || !attrExpr.formatters || attrExpr.formatters.length==0)
			return value;
		var v = value;	
		for (var i = 0; i < attrExpr.formatters.length; i++) {
			var fm = attrExpr.formatters[i];
			if(fm && fm.parse)
				v = fm.parse.apply(scope, [v].concat(fm.arguments));
		};
		return v;	
	},
	formatValue: function (value, attrExpr, scope){
		if(!attrExpr || !attrExpr.formatters || attrExpr.formatters.length==0)
			return value;
		var v = value;	
		for (var i = 0; i < attrExpr.formatters.length; i++) {
			var fm = attrExpr.formatters[i];
			if(fm && fm.format)
				v = fm.format.apply(scope, [v].concat(fm.arguments));
		};
		return v;
	}
};
