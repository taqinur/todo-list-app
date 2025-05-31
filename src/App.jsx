import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import './App.css';

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (newTodo) => {
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  const updateTodoStatus = (todoId, newStatus) => {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === todoId ? { ...todo, status: newStatus } : todo
      )
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <h1>My Kanban Todo List</h1>
        <KanbanBoard 
          todos={todos} 
          addTodo={addTodo} 
          updateTodoStatus={updateTodoStatus}
          key={ todos.length }
        />
      </div>
    </DndProvider>
  );
}

export default App;