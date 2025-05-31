import { useState } from 'react';
import './NewTodoForm.css';

const NewTodoForm = ({ addTodo, currentLength, isOpen, setIsOpen }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTodo = {
      id: currentLength ? currentLength + 1 : 1,
      title: title.trim(),
      description: description.trim(),
      status: 'new',
      createdAt: new Date().toISOString(),
      dueDate: '',
    };

    addTodo(newTodo);
    setTitle('');
    setDescription('');
    setIsOpen(false);
  };

  return (
    <div>
    
      <form className="new-todo-form" onSubmit={handleSubmit}>
      { isOpen ? (
        <>
            <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            className="todo-input"
            required
            />
            <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter task description"
            className="todo-textarea"
            />
            <button type="submit" className="confirm-button">
            Confirm
            </button>
            <button type="button" onClick={() => setIsOpen(false)} className="cancel-button">
            Cancel
            </button>
        </>)
        : (
            <button type="button" onClick={() => setIsOpen(true)} className="add-todo-button">
              + Add A Card
            </button>
          )}
      </form>
  </div>
  );
};

export default NewTodoForm;