## HEADS UP!

This is a temporary repo and might not be published. It's here for discussion related to [this issue](https://github.com/doowb/composer/issues/26).

## Usage

```js
var task = require('base-task');
var confirm = require('base-task-confirm');
var Base = require('base');
var app = new Base();

app.use(task());
app.use(confirm());
```
