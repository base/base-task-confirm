'use strict';

var confirm = require('./');
var task = require('base-task');
var App = require('base');
var app = new App({isApp: true});

app.use(task());
app.use(confirm());

app.task('bar', 'Want to bar?', 'zzz', function(cb) {
  console.log('task bar');
  cb();
});

app.task('baz', function(cb) {
  console.log('task baz');
  cb();
});

app.task('qux', 'fez', function(cb) {
  console.log('task qux');
  cb();
});

app.task('fez', function(cb) {
  console.log('task fez');
  cb();
});

app.task('zzz', function(cb) {
  console.log('task zzz');
  cb();
});

app.build(['foo', 'bar', 'qux'], function(err) {
  if (err) return console.log(err);
  app.build('qux', function(err) {
    if (err) return console.log(err);
    console.log('done');
  });
});
