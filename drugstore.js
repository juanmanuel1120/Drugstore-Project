const fs = require('fs');
const client = require('./config/mongodb/connect.js');
const createTables = require('./config/mongodb/createTables.js');

var createDrugstore = (drugstoresName) => { 
	return fetchDrugstores().then((drugstores) => {	
		return client.connect('drugstoredb', 'drugstores').then((collection) => {
			var newDrugstores = {name: drugstoresName};
			var filter = drugstores.filter((existDrugstores) => existDrugstores.name === drugstoresName);
			
			if (filter.length === 0) {
				return collection.insertOne(newDrugstores)	
			} else {
				console.log('this drugstore alredy exist');
				process.exit();
			}
		})
		.then(result => {console.log('drugstore create');

		}).catch(err => console.log(`Failed to insert drugstores ${err}`));	
	});
}

var createCollection = (name) => {
	console.log('prueba')
	return createTables.create('drugstoredb').then((collection) => {
	   return collection.createCollection(name);
	})
	.then(result => { console.log('collection created');
	  process.exit();
	}).catch(err => console.log(`Error creating pharmacies ${err}`));
	
}

var dropCollection = (name) => {
	return createTables.create('drugstoredb').then((collection) => {
		return collection.dropCollection(`${name}`);
	})
	.then(result => {
		console.log('collection removed');
	}).catch(err => { 
		console.log('This drugstore not exist');
		process.exit();
	}); 
}

var removeDrugstore = (name) => {
	return client.connect('drugstoredb', 'drugstores').then((collection) => {
		var drugstores = {name: name};
		return collection.deleteMany(drugstores, {justOne: 1})
	}).then(result => {
		return dropCollection(name);
	}).then(response => console.log('drugstore removed'));
}

var fetchDrugstores = () => { 
	return client.connect('drugstoredb','drugstores').then((collection) => {
	   return collection.find({}, {projection: {_id: 0, name: 1}}).toArray()
	})
	.then(result => { 
			
	return result;

	}).catch(err => console.log(`error: ${err}`));
}

listDrugstore = (name) => {
	debugger;
	console.log(name.name);
};
 

var logDrugstore = (name) => {
	return client.connect('drugstoredb','drugstore_name').then((collection) => {
	    return fetchDrugstores().then((drugstores) => {		
			var newDrugstores = {name: `${name}`};
			var filter = drugstores.filter((drugstoresName) => drugstoresName.name === name);
			if (filter.length === 0) {
				console.log('there is no drugstore with that name')
				process.exit();
			} else {
				collection.deleteMany({})
				return collection.insertOne(newDrugstores)
			}
		})
		.then((result) => {
			console.log(`You are now on ${name}`);
			process.exit();
		}).catch(err => console.log(`error: ${err}`));

	});
}

var removeDrugstore_name = (name) => {
	return client.connect('drugstoredb', 'drugstore_name').then((collection) => {
	  return collection.deleteMany({},)
	})
	.then(query => {console.log('drugstore removed from the section');
		process.exit();
	}).catch(err => console.log('Error', err));
}

var fetchDrugstore_name = () => {
	return client.connect('drugstoredb', 'drugstore_name').then((collection) => {
	   return collection.findOne({} , {projection: {id: 0}})
	})
	.then(result => { 
   		if (result === null) {
   			console.log("login to a drugstore");
   			process.exit();
   		} else {
			return result;
   		}
	}).catch(err => console.log('Error', err));
};

var createMedicine = (barcode, name, principle, quantity, presentation) => {
    return fetchDrugstore_name().then((drugstore) => {
	    return client.connect('drugstoredb', drugstore.name).then((collection) => {
	
			var newProduct = {
				barcode: barcode.barcode,
				name: name, 
				principle: principle, 
				quantity: quantity, 
				presentation: presentation
			};
			validate(barcode).then((response) => {
				switch (response){
					case false:
						console.log('This product is already exist');
						process.exit();
					break;
					case true:
						return collection.insertOne(newProduct)
					break;
				}	
			})
			.then(result => {
				console.log('Product added successful');
				process.exit();	
			}).catch(err => console.log(`error: ${err}`));
	    });
    });
};

var fetchInventory =  () => {
	return fetchDrugstore_name().then((drugstore) => {
	   return client.connect('drugstoredb', drugstore.name)
	})
	.then((collection) => {
		return collection.find({}, {projection:{"_id": 0}}).toArray()
	})
	.then(result => { 
		return result;
	}).catch(err => console.log(`Failed to find documents: ${err}`));
		 
};

var listInventory = (medicine) => {
	debugger;
	console.log('------');
	console.log(`barcode: ${medicine.barcode}`);
	console.log(`name: ${medicine.name}`);
	console.log(`active principle: ${medicine.principle}`);
	console.log(`quantity: ${medicine.quantity}`);
	console.log(`presentation: ${medicine.presentation}`);
};

var validate = (property) => {
	return fetchInventory().then((drugstore) => {
		if(property.name) {
			var filter = drugstore.filter((fetchMedicines) => fetchMedicines.name === property.name);
			if (filter.length === 0) {
				return true;
			} else {
				return false;
			}
		}else if (property.barcode) {
			var filter = drugstore.filter((fetchMedicines) => fetchMedicines.barcode === property.barcode);
			if (filter.length === 0) {
				return true;
			} else {
				return false;
			}
		}
	});
}

var removeMedicine = (property) => {
	return fetchDrugstore_name().then((drugstore) => {
		return client.connect('drugstoredb', drugstore.name).then((collection) => {
			return validate(property).then((response) => {

				while (property.name) {
			 	    if (response === true) {
			 			console.log('there is no medicine with that name'); 
			 			process.exit();
			 		} 
			        else if(property.name){
						var drugstores = {name: property.name};
						return collection.deleteMany(drugstores, {justOne: 1})
				    }
				}  
					
				while (property.barcode) {
			 	    if (response === true) {
			 		     console.log('there is no medicine with that barcode'); 
			 		     process.exit();
			 		}
			 		else if (property.barcode)  {
						var drugstores = {barcode: property.barcode};
						return collection.deleteMany(drugstores, {justOne: 1})
			 		}
			 	}	
			})
			.then(result => {console.log('Medicine removed');
				process.exit();
			}).catch(err => console.log('Error', err));
		})
	});		
};
 
var updateProducts = (property, properties, principle, quantity, presentation) => { 
	return fetchDrugstore_name().then((drugstore) => {
		return client.connect('drugstoredb', drugstore.name).then((collection) => {
			return fetchInventory().then((inventory) => {
					if (property.name) {
						var filter = inventory.filter((values) => values.name === property.name);
						var filterObject;
						var object = filter.forEach((newObject) => filterObject = newObject);
					
					} else if (property.barcode) {
						var filter = inventory.filter((values) => values.barcode === property.barcode);
						var filterObject;
						var object = filter.forEach((newObject) => filterObject = newObject);
					}

				return validate(property).then((response) => {
			
						if (property.name === undefined){
							property.name = filterObject.name;
						}
					 	if (property.barcode === undefined) {
							property.barcode = filterObject.barcode;
						}
						if (principle === undefined) {
							principle = filterObject.principle;
						}
						if (quantity === undefined) {
							quantity = filterObject.quantity;
						}
						if (presentation === undefined) {
							presentation = filterObject.presentation;
						}

					var newValues = {
					name: properties.name,	
					barcode: properties.barcode,	
					principle: principle, 
					quantity: quantity, 
					presentation: presentation
					};
				

				 	if(response === true) {
						console.log('does no exist')
						process.exist();
					} else { 
						if (property.name) {
							var drugstores = {name: `${property.name}`};
							return collection.updateOne(drugstores, {$set: newValues}, {upsert: true})
						} else if (property.barcode) {
							var drugstores = {barcode: `${property.barcode}`};
							return collection.updateOne(drugstores, {$set: newValues}, {upsert: true})
						}	
					}
				})
				.then(result => {
				 console.log('Updated medicine');
				 process.exit();
							
				}).catch((falseResponse) => { 
					console.log('the medicine could not be updated because it does not exist');
					process.exit();
				});	
			});
		});
	});
}

module.exports = {
	createDrugstore,
	createCollection,
	removeDrugstore,
	removeDrugstore_name,
	logDrugstore,
	listDrugstore,
	fetchDrugstores,
	fetchDrugstore_name,
	createMedicine,
	fetchInventory,
	listInventory,
	removeMedicine,
	updateProducts,
	validate
};


