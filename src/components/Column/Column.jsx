import { useState } from 'react';
import { useDrop } from 'react-dnd';
import TodoItem from '../TodoItem/TodoItem';
import NewTodoForm from '../NewTodoForm/NewTodoForm';
import './Column.css';

const Column = ({ title, todos, onMoveTodo, status, addTodo }) => {
  const [isOpen, SetIsOpen] = useState(false);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TODO',
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      onMoveTodo(item.id, item.status, status);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true })
    })
  }));

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return '#3b82f6';
      case 'ongoing':
        return '#f97316';
      case 'done':
        return '#22c55e';
      default:
        return '#6b7280';
    }
  };

  return (
    <div 
      className="column" 
      style={{ 
        borderTop: `4px solid ${getStatusColor(status)}`,
        backgroundColor: isOver ? '#f8fafc' : 'transparent'
      }}
      ref={drop}
    >
      <h2 className="column-title">{title}</h2>
      <div className="todo-list">
        {todos.length > 0 && todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onMoveTodo={onMoveTodo}
            currentStatus={status}
          />
        ))}
      </div>
      {status === 'new' && <NewTodoForm addTodo={addTodo} currentLength={todos.length} isOpen={isOpen} setIsOpen={SetIsOpen} />}
    </div>
  );
};

export default Column;