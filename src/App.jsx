import { useState } from "react";

function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const enviarMensaje = async () => {
    if (!input.trim()) return;

    const nuevoMensaje = { role: "user", content: input };
    const nuevosMensajes = [...messages, nuevoMensaje];
    setMessages(nuevosMensajes);
    setInput("");

    try {
      const respuesta = await fetch(
        `${import.meta.env.VITE_ENDPOINT_KEY}/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // 🔴 Esto es clave
          },
          body: JSON.stringify({
            message: input,
          }),
        }
      );

      const data = await respuesta.json();
      console.log(data);
      const respuestaBot = data.response;

      console.log(respuestaBot, messages);
      setMessages([
        ...nuevosMensajes,
        { role: "assistant", content: respuestaBot },
      ]);
    } catch (err) {
      console.error("Error al conectar al chatbot:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-600">
          Chatbot Peliculas
        </h1>
        <div className="h-80 overflow-y-auto border border-blue-600 rounded p-4 bg-gray-50 mb-4 space-y-2">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-md max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-200 self-end ml-auto"
                  : "bg-green-200 self-start mr-auto"
              }`}
            >
              <b>{msg.role === "user" ? "Tú" : "Bot"}:</b> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 px-4 py-2 border border-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={enviarMensaje}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
