//modules
require('express-namespace');
var os = require('os');
var model = require('../../model/model.js');

exports.boot = function(app){
    
  app.namespace('/tests/jqtpl',function(){
    
    //routes
    app.get('(view)?', function(req, res){
      res.render('tests/jqtpl/index',{title:'testy node-jqtpl', subtitle:'testujemy składnię jQuery Templates'});	
    });
    
    app.get('array-loop', function(req, res){
      var arr = [1,2,3,6,7,8,4,5,6,7,1,2,3,4,0,0,0,0];
      res.render('tests/jqtpl/array-loop', {
        list:arr,
        title:'test pętli',
        subtitle:'sprawdzamy jak działa {{each}} na tablicy'
        });	  
    });
    
    
    app.get('objects-loop', function(req, res){
      var arr = [
	   { name: 'IBM', equity: 125000000, employees: 12000 },
	   { name: 'Microsoft', equity: 256050000, employees: 234000 },
	   { name: 'Apple', equity: 825000011, employees: 62000 }];
      
      res.render('tests/jqtpl/objects-loop', {
        list:arr,
        title:'test pętli',
        subtitle:'sprawdzamy jak działa {{each}} na obiektach'
        });
    });
    
    app.get('nested-loop', function(req, res){
      var arr = [
	   { name: 'IBM', employees: ['John', 'Mark', 'Steve'] },
	   { name: 'Microsoft', employees: ['Cecil', 'Andrey', 'Irena', 'Antoni', 'Doug'] },
	   { name: 'Apple' }];
      
      res.render('tests/jqtpl/nested-loop', {
        list:arr,
        title:'test pętli',
        subtitle:'sprawdzamy jak działa zagnieżdżona pętla {{each}}'
        });
    });
    
    app.get('nested-loop2', function(req, res){
      var arr = [
	   { name: 'IBM', domain: 'ibm.com', employees: [{name: 'John', login: 'john123'}, {name: 'Mark', login: 'mark_t'}, {name: 'Steve', login: 'steve.jobs'}] },
	   { name: 'Microsoft', domain: 'microsoft.com', employees: [{name: 'Cecil', login: 'cecil_q'}, {name: 'Andrey', login: 'andyyyyy'}, {name: 'Irena', login: 'irena.er'}, {name: 'Antoni', login: 'antex'}, {name: 'Doug', login: 'doug_bek'}] },
	   { name: 'Apple', domain: 'apple.com'}];
      
      res.render('tests/jqtpl/nested-loop2', {
        list:arr,
        title:'test pętli',
        subtitle:'sprawdzamy jak działa zagnieżdżona pętla {{each}} z odwołaniem do danych z pierwszej pętli'
        });
    });
    
    app.get('html1', function(req, res){
      var htmls=[
	'hello <b>world</b>',
	'push <button>me ;)</button>',
	'<input type="radio"/>'
      ];
      res.render('tests/jqtpl/html1', {
      list:htmls,
      title:'test HTMLa',
      subtitle:'sprawdzamy jak działa {{html}} w liście'
      });
    });
    
    app.get('html2', function(req, res){
      var htmls={
	first: 'hello <b>world</b>',
	second: 'push <button>me ;)</button>'
      };
      res.render('tests/jqtpl/html2', {
      parts:htmls,
      title:'test HTMLa',
      subtitle:'sprawdzamy jak działa {{html}} w obiekcie'
      });
    });
    
    app.get('partial1', function(req, res){
      var user={firstName:'Łukasz', lastName:'Twarogowski', occupation:'właściciel'};
      res.render('tests/jqtpl/partial1', {
      user:user,
      title:'test partiala',
      subtitle:'sprawdzamy jak działa {{partial}} dla jednego obiektu'
      });
    });
    
    app.get('partial2', function(req, res){
      var user=
      [{firstName:'Łukasz', lastName:'Twarogowski', occupation:'właściciel'},
       {firstName:'Zbigniew', lastName:'Ziobro', occupation:'ex-poseł'},
       {firstName:'Karol', lastName:'Strasburger', occupation:'opowiadacz kiepskich dowcipów'},
       {firstName:'Jarek', lastName:'kaczyński'}];
      res.render('tests/jqtpl/partial2', {
      user:user,
      title:'test partiala',
      subtitle:'sprawdzamy jak działa {{partial}} dla tablicy obiektów'
      });
    });
    
    app.get('template1', function(req, res){
      var company={name:'Coca-Cola', country:'USA'};
      res.render('tests/jqtpl/template1', {
      company:company,
      title:'test template\'a',
      subtitle:'sprawdzamy jak działa {{tmpl}} dla obiektu'
      });
    });
    
    app.get('template2', function(req, res){
      var companies=[{name:'Coca-Cola', country:'USA'},
		   {name:'Muszynianka', country:'Poland'},
		   {name:'Kraft', country:'Germany'},
		   {name:'Russkij Standart', country:'Russia'},
		   {name:'KPMG', country:'Poland'}];
      res.render('tests/jqtpl/template2', {
      companies:companies,
      title:'test template\'a',
      subtitle:'sprawdzamy jak działa {{tmpl}} dla obiektu'
      });
    });
    
    
    app.get('info', function(req, res){
	var info = {
		node: {
			platform: process.platform,
			version: process.version,
			path: process.execPath,
			prefix: process.installPrefix,
			versions: process.versions
		},
		os:{
			hostname: os.hostname(),
			type: os.type(),
			release: os.release(),
			uptime: os.uptime(),
			totalmem: os.totalmem(),
			freemem: os.freemem(),
			cpus: os.cpus()
		},
		memoryUsage:process.memoryUsage()
	};
      res.render('tests/jqtpl/info', {
      info:info,
      title:'informacje o środowisku',
      subtitle:'versje runtime\'u etc.'
      });
    });
    
  });  
};