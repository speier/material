var ssh = require('./executor').ssh;

module.exports = function(cmd, done) {
  ssh.exec(cmd, function(err, stream) {
    if (err) return done(err);
    stream.on('data', function(data, extended) {
      // console.log('\n' + (extended === 'stderr' ? 'err > ' : '> ') + data);
      done(null, data);
    });
    stream.on('exit', function(code, signal) {
      // console.log('Stream :: exit :: code: ' + code + ', signal: ' + signal);
    });
  });
}