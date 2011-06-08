require('express-namespace');

var model = require('../model/model.js'),
_ = require('../../../node_modules/underscore')._;

exports.boot = function(app){
    
  app.namespace('/tasks',function(){
    
        //routes
        
    app.get('employees', function(req, res){
      var q = req.query.term;
      var list = [
      {id:1, firstName: 'Łukasz', lastName: 'Twarogowski'},
      {id:2, firstName: 'Aleksander', lastName: 'Barnaś'},
      {id:3, firstName: 'Marcin', lastName: 'Wasilewicz'},
      {id:4, firstName: 'Paweł', lastName: 'Poradzki'},
      {id:5, firstName: 'Radek', lastName: 'Tereszczuk'},
      {id:6, firstName: 'Paweł', lastName: 'Twarogowski'},
      {id:7, firstName: 'Tomasz', lastName: 'Wacławski'},
      {id:8, firstName: 'Arek', lastName: 'Gembara'},
      {id:9, firstName: 'Jakub', lastName: 'Ciołkowski'}
      ];
      res.contentType('json');
      if(q && q.length>1){
      	q = q.toLowerCase();
  	  	res.send(_(list).detect(function(i){return i.firstName.toLowerCase().indexOf(q)!=-1 || i.lastName.toLowerCase().indexOf(q)!=-1}));
  	  	}
  	  else
  	  	res.send([]);	
    });
    
    app.get('(view)?', function(req, res){
      var list = [
{
	id:1,
	title:'aplikacja do zarządzania zadaniami',
	description:'opis aplikacji. powinna zarzadzać zadaniami.',
	dueDate: new Date(2011,5,20),
	requestedBy:{
		id:3,
		firstName:'Paweł',
		lastName:'Poradzki'
	},
	assignedTo:{
		id:1,
		firstName:'Łukasz',
		lastName:'Twarogowski'
	},
	origin:
	{
		lat:51,
		lng:21,
		otherValue:1 
	},
	status:'requested',
	progress:.3,
	votes:{
		count:2,
		hasVoted:false
		}
},
{
	id:2,
	title:'aplikacja do zliczania mejli',
	description:'jeszcze dokładnie nie wiadomo',
	dueDate: new Date(2011,5,21),
	requestedBy:{
		id:4,
		firstName:'Marcin',
		lastName:'Wasilewicz'
	},
	assignedTo:{
		id:1,
		firstName:'Łukasz',
		lastName:'Twarogowski'
	},
	origin:
	{
		lat:51.3,
		lng:21.1
	},
	status:'estimated',
	progress:.5,
	estimate:{
		time:120,
		price: 1800
	},
	votes:{
		count:5,
		hasVoted:false
		}
},
{
	id:3,
	title:'aplikacja do robienia aplikacji',
	description:'brak opisu',
	dueDate: new Date(2011,4,11),
	requestedBy:{
		id:4,
		firstName:'Marcin',
		lastName:'Wasilewicz'
	},
	assignedTo:{
		id:1,
		firstName:'Łukasz',
		lastName:'Twarogowski'
	},
	status:'developing',
	progress:.7,
	estimate:{
		time:30,
		price: 900
	},
	activity:
	{
		time: 1.5,
		active:true
	},
	votes:{
		count:11,
		hasVoted:true
		}
}];
	
		res.contentType('json');
  		res.send(list);
      	
    });
    
    
    
    
    
  });
};
  

