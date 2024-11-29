import React from "react";

interface TodoProps {
  text: string;
  isDone: boolean;
  handleDelete: () => void;
  handleToggle: () => void;
}

const TodoComponent: React.FC<TodoProps> = ({
  text,
  isDone,
  handleDelete,
  handleToggle,
}) => {
  return (
    <div className="w-full border-2 border-gray-300 rounded-md m-2">
      <div className="flex flex-row items-center gap-4 p-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={handleToggle}
          className="w-6 h-6 text-white bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-green-500 checked:bg-green-600"
        />
        <p
          className={`flex-grow ${isDone ? "line-through text-gray-500" : ""}`}
        >
          {text}
        </p>
        <div>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoComponent;
