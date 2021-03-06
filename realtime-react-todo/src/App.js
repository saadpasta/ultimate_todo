import React, { Component } from 'react';
import './App.css'; 
import AddForm from "./Components/AddForm/AddForm";
import TaskList from "./Components/TaskList/TaskList";
import db from "./Config/config";
import logo from './logo.png'

class App extends Component {
    constructor(){
        super();
        this.state = {
            taskTxt:'',
            description:'',
            todos:[]
        };
        this.add  = this.add.bind(this);
        this.navabar=this.navabar.bind(this)
    }
    componentWillMount(){
        const previousTodos = this.state.todos;
        db.collection("task").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                previousTodos.push({id:doc.id,task:doc.data()})
            });
        }).then(()=>{this.setState({todos:previousTodos})});

        db.collection("task").onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                for (let i = 0; i < previousTodos.length; i++) {
                    if(previousTodos[i].id === change.doc.id ){
                        previousTodos.splice(i,1);
                    }
                }
                if (change.type !== "removed") {
                    previousTodos.push({id:change.doc.id,task:change.doc.data()});
                }
                this.setState({todos:previousTodos});
            })
        });
    }

    add(task, description){
        db.collection("task").add({
            title: task,
            description: description,
            done: false,
            createdAt: new Date
        }).then(function(docRef) {console.log("Document written with ID: ", docRef.id)})
            .catch(function(error) {console.error("Error adding document: ", error);});
    }
    render() {
        const {todos} = this.state;
        return (
            <div className="App">
                <this.navabar/>
                <div className="row">
                    <div className="col-md-8 mx-auto">
                        <div className="form-group">
                            <AddForm Add={this.add}/>
                        </div>
                        <div className="form-group">
                            <TaskList todoList={todos}/>
                        </div>
                    </div>
                </div>
            </div>
        );
  }

  navabar() {
    return (
      <nav className="navbar navbar-dark bg-dark">
        <a className="navbar-brand" href="#">
          <img src={logo} width="35" height="35" className="d-inline-block align-middle" alt=""/>
            Firebase Realtime Todo
        </a>
      </nav>
    )
  }
}

export default App;
