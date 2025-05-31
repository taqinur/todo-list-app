import { useState } from 'react';
import { useDrop } from 'react-dnd';
import Column from '../Column/Column';
import './KanbanBoard.css';

const KanbanBoard = ({ todos, addTodo, updateTodoStatus }) => {
  const [columns, setColumns] = useState({
    new: todos.filter(todo => todo.status === 'new'),
    ongoing: todos.filter(todo => todo.status === 'ongoing'),
    done: todos.filter(todo => todo.status === 'done')
  });

  const moveTodo = (todoId, fromColumn, toColumn) => {
    setColumns(prevColumns => {
      const todo = prevColumns[fromColumn].find(t => t.id === todoId);
      if (!todo) return prevColumns;

      return {
        ...prevColumns,
        [fromColumn]: prevColumns[fromColumn].filter(t => t.id !== todoId),
        [toColumn]: [...prevColumns[toColumn], { ...todo, status: toColumn }]
      };
    });
    updateTodoStatus(todoId, toColumn);
  };

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TODO',
    drop: (item, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      moveTodo(item.id, item.status, 'new');
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver({ shallow: true })
    })
  }));

  return (
    <div className="kanban-board" ref={drop} style={{ backgroundColor: isOver ? '#f1f5f9' : 'transparent' }}>
      <Column
        title="New"
        todos={columns.new}
        onMoveTodo={moveTodo}
        status="new"
        addTodo={addTodo}
      />
      <Column
        title="Ongoing"
        todos={columns.ongoing}
        onMoveTodo={moveTodo}
        status="ongoing"
      />
      <Column
        title="Done"
        todos={columns.done}
        onMoveTodo={moveTodo}
        status="done"
      />
    </div>
  );
};

export default KanbanBoard;