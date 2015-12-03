var SDC = require('statsd-client'),
    sdc = new SDC({host: 'statsd-1.core.djbnjack.cont.tutum.io', debug: true});

var request = require('request');
var moment = require('moment');

var options = {
  url: 'https://dashboard.tutum.co//api/v1/node/',
  headers: {'Authorization': 'ApiKey djbnjack:97c5dae24f965291a3433efa99684113d2fee38f'}
};

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
    var info = JSON.parse(body);
	info.objects.forEach(function(node) {
		console.log('The time is now: ' + moment().format());
		sdc.gauge(node.nickname + '.memory', node.last_metric.memory);
		sdc.gauge(node.nickname + '.cpu', node.last_metric.cpu);
		sdc.gauge(node.nickname + '.disk', node.last_metric.disk);
	});
  }
}

// Update every 60 seconds
setInterval(function () {
	request(options, callback);
}, 60 * 1000);
