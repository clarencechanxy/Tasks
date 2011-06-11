angular.formatter('nextYear', {
	parse: function(value){
		return value.setYear(value.getYear()+1);
	},
	format: function(value){
		return value.setYear(value.getYear()-1);
	}
});

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