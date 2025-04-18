import { useState } from "react";

export default function AjouterTransactionForm({ onAjout }) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    montant: "",
    type: "ponctuelle",
    statut: "en attente"
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("http://localhost:8000/transactions/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, montant: parseFloat(form.montant) }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Transaction ajoutée !");
        setForm({
          date: "",
          description: "",
          montant: "",
          type: "ponctuelle",
          statut: "en attente"
        });
        if (typeof onAjout === "function") onAjout(); // 🔁 refresh global
      } else {
        setMessage(data.detail || "Erreur lors de l'ajout");
      }
    } catch (err) {
      setMessage("Erreur réseau");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h3>➕ Ajouter une transaction</h3>

      <div style={row}>
        <label>Date :</label>
        <input type="date" name="date" value={form.date} onChange={handleChange} required />
      </div>

      <div style={row}>
        <label>Description :</label>
        <input type="text" name="description" value={form.description} onChange={handleChange} required />
      </div>

      <div style={row}>
        <label>Montant (€) :</label>
        <input type="number" name="montant" value={form.montant} onChange={handleChange} step="0.01" required />
      </div>

      <div style={row}>
        <label>Type :</label>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="ponctuelle">Ponctuelle</option>
          <option value="récurrente">Récurrente</option>
        </select>
      </div>

      <div style={row}>
        <label>Statut :</label>
        <select name="statut" value={form.statut} onChange={handleChange}>
          <option value="prélevé">Prélevé</option>
          <option value="en attente">En attente</option>
        </select>
      </div>

      <button type="submit">Ajouter</button>
      {message && <p style={{ marginTop: "0.5rem" }}>{message}</p>}
    </form>
  );
}

const row = {
  marginBottom: "1rem",
  display: "flex",
  flexDirection: "column"
};
