const madge = require('madge');

madge('path/to/app.js').then((res) => {
	console.log(res.obj());
});