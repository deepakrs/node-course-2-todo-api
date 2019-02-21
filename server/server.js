var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose.js');
var {Todo} = require('./models/todo.js');
var {User} = require('./models/user.js');

var app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (request, response) => {
  // console.log(req.body);
  var todo = new Todo({
    text: request.body.text
  });

  todo.save().then((doc) => {
    response.send(doc);
  }, (e) => {
    response.status(400).send(e);
  })
});

app.get('/todos', (request, response) => {
  Todo.find().then((todos) => {
    response.send({todos});
  }, (e) => {
    response.status(400).send(e);
  });
});

// GET /todos/123456
app.get('/todos/:id', (request, response) => {
  var id = request.params.id;

  if(!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }

    response.send({todo});
  }).catch((e) => {
    response.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

app.delete('/todos/:id', (request, response) => {
  // get the id
  var id = request.params.id;

  // validate the id -> not valid ? return 404
  if (!ObjectID.isValid(id)) {
    return response.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }

    response.send(todo);
  }).catch((e) => {
    response.status(400).send();
  });
});

module.exports = {app};
