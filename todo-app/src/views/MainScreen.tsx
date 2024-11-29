import { useState, useEffect } from "react";
import TodoComponent from "../components/TodoComponent";
import {
  fetchTodos,
  createTodo,
  deleteTodo,
  toggleTodo,
  deleteCompletedTodos,
} from "../services/todoService";
import { OrbitProgress } from "react-loading-indicators";
import { Todo } from "../interfaces/TodoInterface";

function MainScreen() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newTodoText, setNewTodoText] = useState<string>("");

  useEffect(() => {
    const loadTodos = async () => {
      setLoading(true);
      const { todos: fetchedTodos, error } = await fetchTodos();
      setTodos(fetchedTodos);
      setError(error);
      setLoading(false);
    };
    loadTodos();
  }, []);

  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    const { todos: updatedTodos, error } = await createTodo(newTodoText, todos);
    setTodos(updatedTodos);
    setError(error);
    setNewTodoText("");
  };

  const handleDeleteTodo = async (id: string) => {
    const { todos: updatedTodos, error } = await deleteTodo(id, todos);
    setTodos(updatedTodos);
    setError(error);
  };

  const handleDeleteCompletedTodos = async () => {
    const { todos: updatedTodos, error } = await deleteCompletedTodos(todos);
    if (error) {
      setError(error);
    } else {
      setTodos(updatedTodos);
    }
  };

  const handleToggleTodo = async (id: string, isDone: boolean) => {
    const { todos: updatedTodos, error } = await toggleTodo(id, isDone, todos);
    setTodos(updatedTodos);
    setError(error);
  };

  if (error) return <div>{error}</div>;

  return (
    <div className="h-screen w-screen bg-indigo-300 grid grid-rows-[auto,1fr,auto]">
      <header className="p-4">
        <h1 className="text-center text-4xl font-bold font-mono">Todo List</h1>
        <p className="text-center text-lg text-gray-600">A simple todo list</p>
        <div className="flex justify-center items-center pt-10">
          <form onSubmit={handleCreateTodo} className="flex flex-col mb-4">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Enter your Todo here"
              className="w-72 bg-transparent border-b-2 border-white text-center text-white placeholder-gray-800 focus:placeholder-transparent focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="p-1 mt-4 bg-blue-500 text-white rounded"
            >
              Add Todo
            </button>
          </form>
        </div>
      </header>
      <main className="p-6">
        {loading && (
          <div>
            <OrbitProgress
              variant="split-disc"
              color="#51afd8"
              size="small"
              text="Loading"
              textColor=""
            />
          </div>
        )}
        <div className="flex flex-row w-full">
          <div className="flex flex-col w-full">
            {todos.map((todo) => (
              <TodoComponent
                key={todo._id}
                text={todo.text}
                isDone={todo.isDone}
                handleDelete={() => handleDeleteTodo(todo._id)}
                handleToggle={() => handleToggleTodo(todo._id, todo.isDone)}
              />
            ))}
          </div>
          <div className="flex w-full justify-end h-1/2">
            <button
              onClick={handleDeleteCompletedTodos}
              className="p-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete Completed Todos
            </button>
          </div>
        </div>
      </main>
      <footer className="p-4">
        <p>Footer</p>
      </footer>
    </div>
  );
}

export default MainScreen;
