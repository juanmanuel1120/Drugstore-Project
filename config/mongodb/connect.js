const MongoClient = require('mongodb').MongoClient;

var connect = (database, table) => {
	return new Promise((resolve, reject) => {
		const uri = "mongodb+srv://jesus:jesusdovale@cluster0-qf00r.mongodb.net/test?retryWrites=true&w=majority";
		const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
		client.connect(err => {
			if (err) {
				reject(err);
			}else{
				const collection = client.db(`${database}`).collection(`${table}`);
				resolve(collection);
			}
		})
	})
 
}

module.exports = {
	connect
}
