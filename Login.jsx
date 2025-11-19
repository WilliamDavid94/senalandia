const { useState } = React;

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [clave, setClave] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    alert(`Bienvenido ${correo}`);
  };

  const pageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "80vh",
    backgroundColor: "#FEF3C7", // similar a bg-yellow-100
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  };

  const formStyle = {
    backgroundColor: "#FFFFFF",
    padding: "1.5rem",
    borderRadius: "0.75rem",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)",
    width: "24rem",
  };

  const titleStyle = {
    color: "#16A34A", // verde
    fontSize: "1.5rem",
    marginBottom: "1rem",
    fontWeight: "700",
    textAlign: "center",
  };

  const inputStyle = {
    border: "1px solid #D1D5DB",
    padding: "0.5rem",
    width: "100%",
    marginBottom: "0.75rem",
    borderRadius: "0.375rem",
    outline: "none",
  };

  const buttonStyle = {
    backgroundColor: "#16A34A",
    color: "#FFFFFF",
    padding: "0.5rem",
    width: "100%",
    borderRadius: "0.375rem",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
  };

  return (
    <div style={pageStyle}>
      <form onSubmit={handleLogin} style={formStyle}>
        <h2 style={titleStyle}>Iniciar Sesión</h2>
        <input
          style={inputStyle}
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          style={inputStyle}
          type="password"
          placeholder="Clave"
          value={clave}
          onChange={(e) => setClave(e.target.value)}
        />
        <button style={buttonStyle}>Ingresar</button>
      </form>
    </div>
  );
}
