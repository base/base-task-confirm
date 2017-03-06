'use strict';

var Enquirer = require('enquirer');

module.exports = function(options) {
  return function(app) {

    var enquirer = new Enquirer();
    enquirer.register('confirm', require('prompt-confirm'));

    var build = app.build;
    var task = app.task;
    var reRegistered = false;
    var tasks = {};

    app.define('build', function() {
      if (!reRegistered.build) {
        reRegistered = true;
        reRegister(this, tasks);
      }
      return build.apply(this, arguments);
    });

    app.define('task', function(name, msg) {
      if (typeof msg !== 'string' || this.tasks[msg]) {
        return task.apply(app, arguments);
      }

      var args = [].slice.call(arguments, 1);
      cacheTasks(name, tasks, args);

      var callback = args.pop();
      var rest = args.slice(1).concat(function(cb) {
        enquirer.question(name, {message: msg, type: 'confirm'});
        enquirer.prompt(name)
          .then(function(answers) {
            if (answers[name]) {
              app.build(callback, cb);
            } else {
              cb();
            }
          })
          .catch(cb);
      });

      task.call(this, name, rest);
    });
  };
};

// 1. remember any args that are strings that might
// end up being task names, and not question messages
function cacheTasks(name, tasks, args) {
  for (var i = 0; i < args.length; i++) {
    var arg = args[i];
    if (typeof arg === 'string') {
      tasks[arg] = { name: name, args: args };
    }
  }
}

// 2. if any of the args captured in step 1 turn out to be
// task names, re-register them with the original arguments.
// this only needs to be done once.
function reRegister(app, tasks) {
  var keys = Object.keys(tasks);
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (app.tasks[key]) {
      var val = tasks[key];
      app.task(val.name, ...val.args);
      delete tasks[key];
    }
  }
}
