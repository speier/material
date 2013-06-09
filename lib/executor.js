var util = require('util');
var async = require('async');
var ssh2 = require('ssh2');

var ssh = exports.ssh = new ssh2();

exports.execInContext = function(context, hosts, tasks, args) {
  exports.context = context;
  async.each(hosts, function(host, cb) {
    execTasksOnHost(host, tasks, args, cb);
  }, function(err) {
    if (err) throw err;
  });
}

function execTasksOnHost(host, tasks, args, cb) {
  getNodeByHost(exports.context.env.nodes, host, function(node) {
    if (node === 'undefined') throw new Error(util.format('node not found with the specified host name (%s)', host));
    connectToNode(node, function(err) {
      if (err) return cb(err);
      execTasks(tasks, args, function(err) {
        if (err) return cb(err);
      });
    });
  });
}

function getNodeByHost(nodes, host, cb) {
  async.detect(nodes, function(node, found) {
    if (node.name === host || node.host === host) found(true);
  }, cb);
}

function connectToNode(node, cb) {
  ssh.on('connect', function() {
    console.log(util.format('Connecting to %s ...', node.host));
  });
  ssh.on('ready', function() {
    console.log('Connected.');
    cb();
  });
  ssh.on('error', function(err) {
    cb(err);
  });
  ssh.connect({
    host: node.host,
    port: node.port || 22,
    username: node.user,
    privateKey: require('fs').readFileSync(node.pkey)
  });
}

function execTasks(tasks, args, cb) {
  exports.context.env.args = args;
  async.each(tasks, function(task, done) {
    execTask(task, done);
  }, function(err) {
    if (err) return cb(err);
    exports.ssh.on('end', function() {
      console.log('Disconnecting...');
    });
    exports.ssh.on('close', function(had_error) {
      console.log('Disconnected.');
      cb();
    });
    exports.ssh.end();
  });
}

function execTask(task, cb) {
  var method = exports.context[task];

  if (typeof method === 'undefined') {
    return cb(new Error(util.format('specified task not found (%s)', task)));
  }

  method.call(exports.context, cb);
}