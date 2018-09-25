import React, { Component } from 'react';
import TodoItem from './components/TodoItem';
import LocalDB from './actions/LocalDB';
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      todos: [],
      newTodoText: ""
    }
  }
  componentWillMount = () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('service-worker.js').then(function(registration) {
          // Registration was successful
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
          // registration failed :(
          console.log('ServiceWorker registration failed: ', err);
        }).catch(function(err) {
          console.log(err)
        });
      });
    } else {
      console.log('service worker is not supported');
    }
    LocalDB.init()
    .then( () => {
      LocalDB.getAll()
      .then((todo_list) => {
        this.setState( { todos: todo_list});
      });
    });
  };
  componentWillUnmount(){
    LocalDB.close();
  }
  todoTextUpdate = ( e) => {
    this.setState( { newTodoText: e.target.value});
  };
  catchEnter = (e) => {
    if( e.key === "Enter" && this.state.newTodoText !== ""){
      this.createTodo( this.state.newTodoText);
    }
  };
  createTodoClick = (e) => {
    if( this.state.newTodoText !== ""){
      this.createTodo( this.state.newTodoText);
    }
  };
  clearTodoText = () => {
    this.setState( { newTodoText: ""});
  };
  createTodo = ( text) => {
    console.log( "creating new todo:", text);
    LocalDB.createTodo( text)
    .then( (created_date) => {
      console.log( "todo added is:", created_date);
      this.setState( { todos: [...this.state.todos, { date: created_date, text: this.state.newTodoText}]});
      this.clearTodoText();
    });
  };
  completeCheck = (todo) => {
    // console.log( "checked:", e.target.checked);
    console.log( "delete item:", todo);
    LocalDB.deleteTodo( todo.date)
    .then( (success) => {
      console.log( "deleted");
      this.removeTodo( todo);
    });
  };
  removeTodo = (todo) => {
    this.setState( { todos: this.state.todos.filter( item => item.date !== todo.date )});
  };
  render() {
    return (
      <div className="page-wrapper">
        <h1>Todo List</h1>
        <div className="new-todo-wrapper">
          <input type="text" onChange={this.todoTextUpdate} onKeyUp={this.catchEnter}
            placeholder="New todo text"
            value={this.state.newTodoText} />
          <button type="button" className="btn-blue" onClick={this.createTodoClick} >Create</button>
        </div>
        <div className="list-wrapper">
          <ul>
            { this.state.todos.map( (todo,i) => {
                return <TodoItem key={i} item={todo} completeCheck={this.completeCheck}></TodoItem>;
              })}
          </ul>
        </div>
      </div>
    );
  }
}

export default App;
