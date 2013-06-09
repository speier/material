# material

System administration and automation tool, inspired by [Fabric][1].

### Usage:
```
$ npm install material -g
```

create a `matfile.js` (anywhere) with the following contents:
```
var run = require('material').run;

env.nodes = [{
  name: 'local',
  host: '127.0.0.1',
  user: 'my-username',
  pkey: 'my-pkey-path'
}];

function host_type(done) {
  run('uname -s', function(err, result) {
    console.log(result.toString());
    done();
  });
}
```

then execute with the following command:
```
$ mat -h local host_type
```

thats it, you can see a similar result on your console:
```
Connecting to 127.0.0.1 ...
Connected.

Linux

Disconnecting...
Disconnected.
```

Basically my idea is to have a simple tool for daily DevOps tasks in Node.

Currently I'm busy working on more features and tests. Please be patient.

### License

Licensed under the MIT License: http://www.opensource.org/licenses/mit-license.php

[1]: http://fabfile.org
