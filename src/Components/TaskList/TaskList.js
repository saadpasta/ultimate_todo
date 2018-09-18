import React, {Component} from "react";
import { Button, Checkbox, Table} from 'react-bootstrap';
import db from "../../Config/config";

class TaskList extends Component{

    constructor(porps){
        super(porps);
        this.delTask = this.delTask.bind(this);
    }

    delTask(id){
        console.log(id)
        db.collection("task").doc(id).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });
    }

    render(){
        const {todoList} = this.props;
        return(
            <table class="table table-striped">
                <thead class="thead-dark">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Task</th>
                    <th scope="col">Description</th>
                    <th scope="col">Done</th>
                    <th scope="col">Delete</th>
                </tr>
                </thead>
                <tbody >
                {todoList.map((todo, index) => {
                    return <tr key={todo.id}>
                        <td scope="row">{index+1}</td>
                        <td>{todo.task.title}</td>
                        <td> {todo.task.description} </td>
                        <td><Checkbox/></td>
                        <td><Button bsStyle="danger" onClick={()=>{this.delTask(`${todo.id}`)}}> Del</Button></td>
                    </tr>
                })}
                </tbody>
            </table>
        );
    }

}

export default TaskList;