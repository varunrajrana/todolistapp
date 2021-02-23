import React, { Fragment, useEffect, useState } from 'react';
import EditTodo from "./EditTodo";


export default function ListTodo() {

    const [todo, setTodos] = useState([]);

    const deleteTodo = async id => {
      try {
        const deleteTodo= await fetch(`http://localhost:5000/todo/${id}`,{method:"DELETE"});
        setTodos(todo.filter(todo=> todo.todo_id!== id));
      } catch (error) {
        console.error(error.message)
      }
    }

    const getTodos = async() =>{
        try {
            const response = await fetch("http://localhost:5000/todo");
            const jsonData = await response.json();

            setTodos(jsonData);
        } catch (error) {
            console.error(error.message);
        }
    }
    
    useEffect(() => {
        getTodos();
    },[]);
    
    return (
        <Fragment>
            <table className="table mt-5 text-center">
                <thead>
                <tr>
                    <th>Description</th>
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
                </thead>
                <tbody>
                {todo.map(todo => (
                    <tr key = {todo.todo_id}>
                        <td>{todo.description}</td>
                        <td><EditTodo todo={todo} /></td>
                        <td><button className="btn btn-danger" onClick={()=>deleteTodo(todo.todo_id)}>Delete</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </Fragment>
    )
}
