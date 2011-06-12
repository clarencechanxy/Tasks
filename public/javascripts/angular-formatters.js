
// for testing only: shows in a bound datepicker a year ahead from given date 
angular.formatter('nextYear', {
	parse: function(value){
		var v = new Date(value.valueOf());
		var y = v.getFullYear();
		y--;
		v.setYear(y);
		return v;
	},
	format: function(value){
		var v = new Date(value.valueOf());
		var y = v.getFullYear();
		y++;
		v.setYear(y);
		return v;
	}
});

// for testing only: displays in a bound datepicker a date with a specified amount of months added to it
angular.formatter('addMonths', {
	parse: function(value, months){
		return value.setMonth(value.getMonth() + months);
	},
	format: function(value, months){
		return value.setMonth(value.getMonth() - months);
	}
});

angular.formatter('addNumber', {
	parse: function(value, number){
		return value + number;
	},
	format: function(value, number){
		return value - number;
	}
});