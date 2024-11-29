import { Todo } from "../interfaces/TodoInterface";
import { GenericAPI } from "./api";

export const fetchTodos = async (): Promise<{
  todos: Todo[];
  error: string | null;
}> => {
  try {
    const response = await GenericAPI.getAll<Todo>("/todos");
    return { todos: response.data, error: null };
  } catch (err) {
    return { todos: [], error: "Error fetching todos: " + err };
  }
};

export const fetchTodo = async (
  id: string
): Promise<{
  todo: Todo | null;
  error: string | null;
}> => {
  try {
    const response = await GenericAPI.getById<Todo>("/todos", id);
    return { todo: response.data, error: null };
  } catch (error) {
    return { todo: null, error: "Error fetching todo: " + error };
  }
};

export const createTodo = async (
  newTodoText: string,
  todos: Todo[]
): Promise<{ todos: Todo[]; error: string | null }> => {
  if (!newTodoText.trim()) {
    return { todos, error: null };
  }
  try {
    const response = await GenericAPI.create<Todo, Omit<Todo, "_id">>(
      "/todos",
      { text: newTodoText, isDone: false }
    );
    return { todos: [...todos, response.data], error: null };
  } catch (error) {
    return { todos, error: "Error creating todo: " + error };
  }
};

export const toggleTodo = async (
  id: string,
  isDone: boolean,
  todos: Todo[]
): Promise<{ todos: Todo[]; error: string | null }> => {
  try {
    await GenericAPI.update<Todo>("/todos", id, { isDone: !isDone });
    const updateTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, isDone: !isDone } : todo
    );
    return { todos: updateTodos, error: null };
  } catch (error) {
    return { todos, error: "Error updating todo: " + error };
  }
};

export const deleteTodo = async (
  id: string,
  todos: Todo[]
): Promise<{ todos: Todo[]; error: string | null }> => {
  try {
    await GenericAPI.delete("/todos", id);
    const updatedTodos = todos.filter((todo) => todo._id !== id);
    return { todos: updatedTodos, error: null };
  } catch (error) {
    return { todos, error: "Error deleting todo: " + error };
  }
};

export const deleteCompletedTodos = async (
  todos: Todo[]
): Promise<{ todos: Todo[]; error: string | null }> => {
  try {
    await GenericAPI.deleteMany("/todos/completed");
    const updatedTodos = todos.filter((todo) => !todo.isDone);
    return { todos: updatedTodos, error: null };
  } catch (error) {
    return { todos, error: "Error deleting completed todos: " + error };
  }
};
