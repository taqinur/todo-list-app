import { useState, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import './TodoItem.css';

const TodoItem = ({ todo, onMoveTodo, currentStatus }) => {
  const [showContextMenu, setShowContextMenu] = useState(false);
  const contextMenuRef = useRef(null);
  const [isDue, setIsDue] = useState(false);

  useEffect(() => {
    const dueDate = new Date(todo.dueDate);
    const intervalId = setInterval(() => {
      const now = new Date();
      if (now >= dueDate && !isDue) {
        setIsDue(true);
        alert(`Todo item "${todo.title}" is due!`);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [todo, isDue]);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TODO',
    item: { id: todo.id, status: currentStatus },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  const handleContextMenu = (e) => {
    e.preventDefault();
    setShowContextMenu(true);
    if (contextMenuRef.current) {
      contextMenuRef.current.style.left = `${e.pageX}px`;
      contextMenuRef.current.style.top = `${e.pageY}px`;
    }
  };

  const handleClickOutside = (e) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
      setShowContextMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const getAvailableMoves = () => {
    const allStatuses = ['new', 'ongoing', 'done'];
    return allStatuses.filter(status => status !== currentStatus);
  };

  const handleMove = (newStatus) => {
    onMoveTodo(todo.id, currentStatus, newStatus);
    setShowContextMenu(false);
  };

  const handleDateTimeChange = (e) => {
    const dueDate = new Date(e.target.value);
    const now = new Date();
    if (dueDate < now) {
      alert('This task is overdue!');
    }
    todo.dueDate = dueDate.toISOString();
    const todos = JSON.parse(localStorage.getItem('todos'));
    const todoIndex = todos.findIndex(t => t.id === todo.id);
    todos[todoIndex] = todo;
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return '#2196F3';
      case 'ongoing':
        return '#f97316';
      case 'done':
        return '#4CAF50';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <div 
      className="todo-item"
      onContextMenu={handleContextMenu}
      ref={drag}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="todo-item-header">
        <h3>{todo.title}</h3>
        <span
          className="status-label"
          style={{ backgroundColor: getStatusColor(todo.status) }}
        >
          {todo.status}
        </span>
      </div>
      {todo.description && <p className="todo-item-description">{todo.description}</p>}
      {todo.id && <p className="todo-item-description"># {todo.id}</p>}
      {currentStatus === 'ongoing' && (
        <div className="datetime-container">
          <input
            type="datetime-local"
            onChange={handleDateTimeChange}
            className="datetime-input"
          />
        </div>
      )}
      
      {showContextMenu && (
        <div className="context-menu" ref={contextMenuRef}>
          {getAvailableMoves().map((status) => (
            <button
              key={status}
              onClick={() => handleMove(status)}
              className="context-menu-item"
            >
              Move to {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoItem;