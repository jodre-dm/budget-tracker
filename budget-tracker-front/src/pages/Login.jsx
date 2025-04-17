import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");             // champ email
  const [password, setPassword] = useState("");       // champ mot de passe
  const [erreur, setErreur] = useState(null);         // message d'erreur
  const navigate = useNavigate();                     // permet de rediriger

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur(null);

    // Format attendu par FastAPI : x-www-form-urlencoded
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Connexion réussie → stockage du token
        localStorage.setItem("token", data.access_token);
        const payloadBase64 = data.access_token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));
        localStorage.setItem("prenom", decoded.prenom); // ✅ stockage du prénom

        navigate("/dashboard"); // redirection vers dashboard
      } else {
        setErreur(data.detail || "Échec de la connexion");
      }
    } catch (err) {
      setErreur("Erreur réseau");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 400, margin: "auto" }}>
      <h2>Connexion</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email :</label><br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <label>Mot de passe :</label><br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{ marginTop: "1.5rem" }}>
          Se connecter
        </button>
      </form>

      {erreur && <p style={{ color: "red", marginTop: "1rem" }}>{erreur}</p>}
    </div>
  );
}
