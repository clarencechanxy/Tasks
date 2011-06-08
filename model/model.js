var mongoose = require('mongoose');

mongoose.connection.on("open", function(){
  console.log("mongodb is connected!!");
});

mongoose.connection.on("error", function(){
  console.log("error during connecting!!");
});

mongoose.connect('mongodb://127.0.0.1/Invoices');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

//schemas

var address = {
	country : String,
	city : String,
	street : String,
	streetNumber : String,
	flat : String,
	zipCode : String 
};

var company = {
	name : String,
	fullName : String,
	taxId : Date,
	address : address,
	phone : String
};

var schemas = {};

schemas.Company = new Schema(company);

schemas.InvoiceItem = new Schema({
	title : String,
	unit : String,
	quantity : Number,
	price : Number,
	netAmount : Number,
	taxRate : Number,
	totalAmount : Number
});

schemas.Invoice = new Schema({
	number : String, 
	issueDate : Date,
	paymentDate : Date,
	issuer : company,
	customer : company,
	items : [schemas.InvoiceItem],
	totalNetAmout : Number,
	totalTax : Number,
	totalAmount : Number
});



//models

exports.Company = mongoose.model('Companies', schemas.Company);
exports.Invoice = mongoose.model('Invoices', schemas.Invoice);