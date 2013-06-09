var vm = require('vm');
var fs = require('fs');
var path = require('path');
var executor = require('./executor');

var context = vm.createContext({
  exports: {},
  require: matreq,
  console: console,
  env: {
    args: [],
    nodes: []
  }
});

exports.execute = function(hosts, tasks, args) {
  if (typeof hosts === 'undefined') throw new Error('hosts is undefined');
  if (typeof hosts === 'string') hosts = hosts.split(',');
  if (typeof tasks === 'string') tasks = tasks.split(',');
  if (typeof args === 'string') args = args.split(',');

  if (typeof tasks === 'undefined') {
    tasks = [];
    if (tasks.length == 0) tasks.push('main');
  }

  var matfile = path.join(process.cwd(), 'matfile.js');
  if (!fs.existsSync(matfile)) throw new Error('matfile does not exists');

  var code = fs.readFileSync(matfile);
  vm.runInContext(code, context);

  executor.execInContext(context, hosts, tasks, args);
}

function matreq(name) {
  return (name === 'material') ? require('./material') : require(name);
}