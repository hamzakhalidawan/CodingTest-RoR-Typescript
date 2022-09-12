import React, { useEffect, useState } from "react";
import { Container, ListGroup, Form } from "react-bootstrap";
import { ResetButton } from "./uiComponent";
import axios from "axios";

type TodoItem = {
  id: number;
  title: string;
  checked: boolean;
  todo_image: string;
};

type Props = {
  todoItems: TodoItem[];
};

const TodoList: React.FC<Props> = ({ todoItems }) => {
  const [todo, setTodo] = useState<Array<TodoItem>>([]);

  useEffect(() => {
    setTodo(todoItems);
    const token = document.querySelector(
      "[name=csrf-token]"
    ) as HTMLMetaElement;
    axios.defaults.headers.common["X-CSRF-TOKEN"] = token.content;

  }, [setTodo]);

  const checkBoxOnCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoItemId: number
  ): void => {
    setTodo([...todo].map(object => {
      if (object.id === todoItemId) {
        return {
          ...object,
          checked: e.target.checked,
        }
      }
      else return object;
    }))
    axios.post("/todo", {
      id: todoItemId,
      checked: e.target.checked,
    });
  };

  const resetButtonOnClick = (): void => {
    axios.post("/reset").then(() => location.reload());
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoItemId: number
  ): void => {
    e.preventDefault();
    // setImage(e.target.files[0])
    let image = e.target.files[0]
    const formData = new FormData()
    formData.append('image', image)
    formData.append('todoId', todoItemId.toString())
    axios.post("/todo_image", formData)
    onSelectFile(e, todoItemId);
  }

  const onSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    todoItemId: number
  ): void => {
    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    const objectUrl = URL.createObjectURL(e.target.files[0])
    setTodo([...todo].map(object => {
      if (object.id === todoItemId) {
        return {
          ...object,
          todo_image: objectUrl,
        }
      }
      else return object;
    }))
  }

  return (
    <Container>
      <h3>2022 Wish List</h3>
      <ListGroup>
        {todo.map((todo) => (
          <ListGroup.Item key={todo.id}>
            <Form.Check
              type="checkbox"
              label={todo.title}
              checked={todo.checked}
              onChange={(e) => checkBoxOnCheck(e, todo.id)}
            />
            <input type="file"
              accept="image/jpeg" /// for images
              onChange={(e) => handleFileUpload(e, todo.id)}
              style={{ float: "right" }}
            />
            {todo.todo_image &&
              <img src={todo.todo_image} width={150} height={150} />
            }
          </ListGroup.Item>
        ))}
        <ResetButton onClick={resetButtonOnClick}>Reset</ResetButton>
      </ListGroup>
    </Container>
  );
};

export default TodoList;