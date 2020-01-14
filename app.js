const yargs = require('yargs');
const drugstore = require('./drugstore.js');
const mongodb = require('./config/mongodb/connect.js');
var readlineSync = require('readline-sync');

var argv = yargs 
.command('create', 'to create a drugstore', {
	name:{
		desciption: 'drugstore name to delete',
		alias: 'n',
		type: 'string'
	}
}).command('log', 'access to a drugstore', {
	name:{
		desciption: 'drugstore name to delete',
		alias: 'n',
		type: 'string'
	}
}).command('drugstores', 'to list drugstores', {
	
}).command('add', 'add new medicine to a drugstore', {
	
}).command('remove', 'to remove medicines from a drugstore', {
	name: {
		desciption: 'name of product to update',
		alias: 'n',
		type: 'string',
	}
}).command('update', 'update medicine from a drugstore', {
	name: {
		desciption: 'name of product to update',
		alias: 'n',
		type: 'string',
	},
	principle: {
		desciption: 'principle of product to update',
		alias: 'p',
		type: 'string',
	},
	quantity: {
		desciption: 'quantity of product to update must be at least 1',
		alias: 'q',
	},
	presentation: {
		desciption: 'presentation of product to update must be box, syrup or tablet',
		alias: 'pt',
		type: 'string',
	},
}).command('list', 'to list products from a drugstore', {
	
})
.help()
.alias('help', 'h')
.argv;

var exclude = process.argv.slice(2,3);
var command;
var getCommand = exclude.forEach((action) => command = action);

	if (command === 'create') {
		var drugstoreName = readlineSync.question('Drugstore name: ');

		while (drugstoreName.length === 0) {
			console.log('To create a drugstore you must enter a name');
			drugstoreName = readlineSync.question('Drugstore name: ');
			if (drugstoreName.length === 0) {continue}	
		} 

		while (drugstoreName.length > 10) {
			console.log('the drugstore cannot have more than 10 characters');
			drugstoreName = readlineSync.question('Drugstore name: ');
			if (drugstoreName.length > 10) {continue}
		}

		drugstore.createDrugstore(drugstoreName).then((res) => {
		return drugstore.createCollection(drugstoreName)
		}).catch((errorMessage)=> console.log(errorMessage));

	}	else if (command === 'log') {

		var drugstoreMedicine = readlineSync.question('log-in to:');

		while (drugstoreMedicine.length === 0) {
			console.log('write the name of a drugstore already created');
			drugstoreMedicine = readlineSync.question('log-in to:');
			if (drugstoreMedicine.length === 0) {continue}
		}

		drugstore.logDrugstore(drugstoreMedicine).then((res) => {
		}).catch((errorMessage) => console.log(errorMessage));

	}	else if (command === 'add'){

		drugstore.fetchDrugstore_name().then((res) => {
			console.log(res.name);
			console.log('------')
		});

		var barcode = readlineSync.question('medication bar code: ');

        var value =  Number(barcode);
        var decimal = value % 1;

		while (barcode.length === 0 || barcode < 1 || isNaN(barcode) || barcode.length > 13 || barcode.length < 13 || decimal !== 0) {

			  value =  Number(barcode);
        	  decimal = value % 1;   

			if(barcode.length === 0) {
			    console.log('the bar code cannot be empty');
			    barcode = readlineSync.question('medication bar code: ');
		        continue
		    }else if (barcode < 1) {
		    	console.log('the bar code must be 1 number and up');
			    barcode = readlineSync.question('medication bar code: ');
		        continue
		    }else if (isNaN(value) === true) {
		    	console.log('the bar code must be only integer number');
			    barcode = readlineSync.question('medication bar code: ');
		        continue	
		    }else if (barcode.length > 13) {
			    console.log('the bar code cannot have more than 13 characters');
			    barcode = readlineSync.question('medication bar code: ');
			    continue
		    }else if (barcode.length < 13) {
			    console.log('the bar code must have 13 characters');
			    barcode = readlineSync.question('medication bar code: ');
			    continue
		    }else if (decimal !== 0) {
		    	console.log('the bar code must be whole numbers');
		    	barcode = readlineSync.question('medication bar code: ');
			    continue
		    }

		    else {break} 		
		}

		var medicineName = readlineSync.question('Medicine name: ');

		while (medicineName.length === 0) {
			console.log('you must write a name for medicine');
			medicineName = readlineSync.question('Medicine name: ');

			if (medicineName.length === 0) {continue}
			else{break}		
		}

		while ( medicineName.length > 20) {
			console.log('the medicine cannot have more than 20 characters');
			medicineName = readlineSync.question('Medicine name: ');

			if (medicineName.length > 20) {continue}
			else{break}
		}

		var principle = readlineSync.question('active principle: ');

		while (principle.length === 0) {
			console.log('you have to add a principle for medicine');
			principle = readlineSync.question('active principle: ');

			if (principle.length === 0) {continue}
			else{break}		
		}

		var quantity = readlineSync.question('quantity: ');

		var value =  Number(quantity); 
		var decimal = value % 1;
		 
		while(quantity.length === 0 || isNaN(quantity) || quantity < 1 || decimal !== 0){

			 value =  Number(quantity); 
			 decimal = value % 1;

			if(quantity.length === 0 ) {
				console.log('quantity can not be empty')
				quantity = readlineSync.question('quantity: ');
				continue
			}else if (isNaN(quantity)) {
				console.log('the quantity cannot be string, it must be a number');
				quantity = readlineSync.question('quantity: ');
				continue
			}else if (quantity < 1) {
				console.log('quantity must be at least 1');
				quantity = readlineSync.question('quantity: ');
				continue
			}else if (decimal !== 0) {
				console.log('quantity must be an integer');
				quantity = readlineSync.question('quantity: ');
				continue
			}

			else {break}
		}

		var presentation = readlineSync.question('presentation: ');

		while(presentation !== 'box' && presentation !== 'syrup' && presentation !== 'tablet'){
			console.log('presentation must be box, syrup, or tablet');
			presentation = readlineSync.question('presentation: ');

			if (presentation !== 'box' && presentation !== 'syrup' && presentation !== 'tablet') {continue}
			else{break}

		}
		const ObjectBarcode = {barcode: barcode}
		 drugstore.createMedicine(ObjectBarcode,medicineName,principle,quantity,presentation).then()
		 .catch((errorMessage) => console.log(errorMessage));

	}	else if (command === 'list'){

		drugstore.fetchDrugstore_name().then((res) => {
			console.log(res.name)
			console.log('------');
		});	

		drugstore.fetchInventory().then((res) => {

			if (res.length === 0) {
				console.log('there are no products. Add new products');
				process.exit();
			}
			
			console.log(`there are ${res.length} medicine(s).`);
			res.forEach((medicines) => drugstore.listInventory(medicines));
			process.exit();		

		}).catch((errorMessage) => console.log('Error:',errorMessage));

	}	else if (command === 'remove'){
		
		drugstore.fetchDrugstore_name().then((res) => {
			console.log(res.name);
			console.log('------');
		});
		var query;
			if (argv.name !== undefined && argv.name.length === 0) {
				console.log('you must enter the name of the medicine you want to delete');
				process.exit();
			}else if (argv.barcode !== undefined &&  argv.barcode.length === 0) {
				console.log('you must enter the medication bar code you wish to delete');
				process.exit();
			}	

			if (argv.name) {
				query = {name: argv.name}
			}else if (argv.barcode) {
				query = {barcode: `${argv.barcode}`}
			}else{
				console.log('must type a name or barcode tso delete')
			}
		drugstore.removeMedicine(query).then((res) => {	
	    }).catch((errorMessage) => console.log(errorMessage));

	}	else if(command === 'delete'){
		var name = readlineSync.question('Drugstore name to delete:');	

		while (name.length === 0) {
			console.log('Enter the name of the drugstore you wish to remove');	
			name = readlineSync.question('Drugstore name to delete:');
		    if (name.length === 0) {continue}	
		}
		
		drugstore.removeDrugstore(name).then((res) => {
		return  drugstore.removeDrugstore_name(name)
		}).catch((errorMessage) => console.log(errorMessage));
		
	}	else if(command === 'update'){

		drugstore.fetchDrugstore_name().then((res) => {
			console.log(res.name);
			console.log('------');
		});
		var value = Number(argv.quantity); 
		var decimal = value % 1;
		var regex = /\D/;
		var barcode = `${argv.barcode}`;

		var query;
	
		if (argv.barcode !== undefined && argv.barcode.length === 0) {
			console.log('to update you must add the bar code');
			process.exit();
		}else if (regex.test(argv.barcode)) { 
			console.log('the bar code must be only integer number');
			process.exit();
		}else if (barcode.length > 13) {
			console.log('the bar code cannot have more than 13 characters');
			process.exit();
		}else if (barcode.length < 13) {
			console.log('the bar code must have 13 characters');
			process.exit();
		}else if  (argv.name !== undefined && argv.name.length === 0) {
			console.log('to update you must enter the name of a medicine');
			process.exit();
		}else if (argv.principle === '') {
			console.log('to update you must add the principle');
			process.exit();
		}else if (argv.quantity !== undefined && argv.quantity.length === 0) {
			console.log('quantity must be at least 1');
			process.exit();
		}else if (isNaN(value) && argv.quantity !== undefined) {
			console.log('the quantity cannot be string, it must be a number');			
			process.exit();
		}else if (argv.quantity < 1) {
			console.log('the quantity must be 1 and up');
			process.exit();
		}else if (decimal !== 0 && argv.quantity !== undefined) {
			console.log('quantity must be an integer');
			process.exit();
		}else if (argv.presentation !== 'syrup' && argv.presentation !== 'tablet' && argv.presentation !== 'box' && argv.presentation !== undefined) {
			console.log('Presentation must be syrup, tablet or box.');
			process.exit();
		}

		var properties = Object.keys(argv)[1]
		if (properties === 'name') {
			query = {name: argv.name}
		}else if (properties === 'barcode') {
			query = {barcode: `${argv.barcode}`}
		}else{
			console.log('must type a name or barcode to delete')
		}
		var property = {
			name: argv.name,
			barcode: `${argv.barcode}`
		}
		drugstore.updateProducts(query, property,argv.principle, argv.quantity, argv.presentation).then()
		.catch((errorMessage) => console.log(errorMessage));
		

	}	else if(command === 'drugstores'){
			drugstore.fetchDrugstores().then((drugstores) => {
			console.log(`there are ${drugstores.length} drugstore(s).`);

			var list = drugstores.forEach((name) => drugstore.listDrugstore(name));
			process.exit();
			}).catch((errorMessage) => console.log('Error:',errorMessage));

	} else {
		console.log("This command have no action");
	}
