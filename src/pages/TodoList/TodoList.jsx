import { useState, useRef, useEffect } from 'react';
import { PropaneSharp } from '@mui/icons-material';
import { Typography, Button, Modal, Box } from '@mui/material'
import TodoItem from '../../components/Todo/TodoItem';
import './TodoList.css';
import '../../components/Todo/TodoModal.jsx'
import * as todoService from '../../services/todoService'
import TodoModal from '../../components/Todo/TodoModal.jsx';

const TodoList = (props) => {
  const [formData, setFormData] = useState({ // reMOVED THIS from MODAL
    title: '',
    description: '',
    dueDate: new Date(),
  })
  const handleChange = evt => { // MOVED THIS TO MODAL
    setFormData({...formData, [evt.target.name]: evt.target.value })
  }
  useEffect(() => {
    const fetchAllTodos = async () =>{
      const todoData = await todoService.getAll()
      setTodos(todoData)
    }
    fetchAllTodos()
  }, [])
  
  const [todos, setTodos] = useState([])
  
  const handleAddTodo = async newTodoData => {
    const newTodo = await todoService.create(newTodoData)
    setTodos([...todos, newTodo])
  }
  
  const handleSubmit = evt => { // MOVED THIS TO MODAL
    evt.preventDefault()
    handleAddTodo(formData)
  }

  const handleDeleteTodo = async id => {
    const deletedTodo = await todoService.deleteTodo(id)
    setTodos(todos.filter(todo => todo._id !== deletedTodo._id))
  }

  const handleUpdateTodo = updatedTodoFormData => {
    console.log(updatedTodoFormData)
    // // Using map to replace just the todo that was updated
    // const newTodosArray = todos.map(todo => 
    //   todo._id === updatedTodoFormData._id ? updatedTodoFormData : todo
    // )
    // setTodos(newTodosArray)
		// // navigate('/') -------------- Navigate back to main page after submission
  }

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 6,
    p: 4,
  }
  
  return (
    <div className='todo-list'>
      <div className='todo-list-header | flex justify-between'>
        <h1>Todos</h1>
        <div>searchbar</div>
        <div>grab button</div>
      </div>
      <div>
        <Button onClick={handleOpen}>Add Todo</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
          formData={formData}
        >
          <Box sx={style} formData={formData}>
            <Typography id='modal-modal-title' variant='h6' component='h2'>
              Add Todo
            </Typography>
            <Typography id='modal-modal-description' sx={{ mt: 2 }} formData={formData}>
              <TodoModal
                setFormData={setFormData}
                formData={formData}
                handleAddTodo={handleAddTodo}
              />
            </Typography>
          </Box>
        </Modal>
      </div>
      <div className='todo-list-showing | flex'>
        <div>Showing Tag</div>
      </div>
      <div className='todo-list-body'>
        <>
          {todos.map(todo => 
            <TodoItem
              key={todo._id}
              todo={todo}
              handleDeleteTodo={handleDeleteTodo}
              handleUpdateTodo={handleUpdateTodo}
              user={props.user}
              // isList={true}
            />
          )}
        </>
      </div>
    </div>
    );
  }
  
  export default TodoList;

  