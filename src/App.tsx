import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    const sub = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    return () => sub.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main className="p-4">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        {/* ✅ mostra o loginId (ex: email ou username) do usuário autenticado */}
        <h1>{user?.signInDetails?.loginId}'s todos</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user?.username && (
            <span>
              Signed in as <strong>{user.username}</strong>
            </span>
          )}
          <button onClick={signOut}>Sign out</button>
        </div>
      </header>

      <button onClick={createTodo}>+ new</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.content}
            <button
              onClick={() => deleteTodo(todo.id)}
              style={{ marginLeft: 8 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 24 }}>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
