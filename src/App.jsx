import './App.css';

import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs';

// const API = 'http://0.0.0.0:8090';
// const aaa = '/todos'
const API = 'https://raw.githubusercontent.com/HokkyokuArt/vercel-react-todo/main/data'
const aaa = '/db.json'

function App() {
    const [title, setTitle] = useState('');
    const [time, setTime] = useState('');
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load todos on page load
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const res = await fetch(API + aaa)
                .then(res => res.json())
                .then(data => data)
                .catch(
                    err => console.log(err)
                );

            console.log(res.todos)

            setLoading(false);
            // setTodos(res);
            setTodos(res.todos);
        };
        loadData();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        const todo = {
            id: Math.random(),
            title,
            time,
            done: false,
        };
        // Envio da tarefa para a API
        await fetch(API + '/todos', {
            method: 'POST',
            body: JSON.stringify(todo),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        setTodos(prevState => [...prevState, todo]);
        setTime('');
        setTitle('');
    };

    const handleEdit = async todo => {
        todo.done = !todo.done;
        // Editar tarefa na API
        const data = await fetch(API + aaa + todo.id, {
            method: 'PUT',
            body: JSON.stringify(todo),
            headers: {
                "Content-Type": "application/json",
            }
        });
        setTodos(prevState => prevState.map(t => t.id === data.id ? t = data : t));
    };


    const handleDelete = async id => {
        // Excluir tarefa na API
        await fetch(API + aaa + id, {
            method: 'DELETE',
        });
        setTodos(prevState => prevState.filter(todo => todo.id !== id));
    };


    if (loading) {
        return <div className="loader"></div>;
    }

    return (
        <div className="App">
            <div className="todo-header">
                <h1>React Todo</h1>
            </div>
            <div className="form-todo">
                <h2>Insira sua proxima tarefa:</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label htmlFor="title">O que voc?? vai fazer?</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="T??tulo da tarefa"
                            onChange={e => setTitle(e.target.value)}
                            value={title || ''}
                            required
                        />
                    </div>
                    <div className="form-control">
                        <label htmlFor="time">Dura????o:</label>
                        <input
                            type="text"
                            name="time"
                            placeholder="Tempo estimado (em horas)"
                            onChange={e => setTime(e.target.value)}
                            value={time || ''}
                            required
                        />
                    </div>

                    <input type="submit" value="Criar tarefa" />
                </form>
            </div>
            <div className="list-todo">
                <h2>Lista de tarefas:</h2>
                {todos.length === 0 && <p>N??o h?? tarefas!</p>}
                {todos.map(todo => (
                    <div className="todo" key={todo.id}>
                        <h3 className={todo.done ? 'todo-done' : ''}>{todo.title}</h3>
                        <p>Dura????o: {todo.time} hrs</p>
                        <div className="actions">
                            <span onClick={() => handleEdit(todo)}>
                                {!todo.done ? (<BsBookmarkCheck />) : (<BsBookmarkCheckFill />)}
                            </span>
                            <BsTrash onClick={() => handleDelete(todo.id)} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
