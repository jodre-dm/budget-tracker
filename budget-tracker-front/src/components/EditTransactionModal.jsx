import { useEffect, useState } from "react";

export default function EditTransactionModal({ transaction, onClose, onUpdate }) {
  const [form, setForm] = useState({ ...transaction });
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    setForm({ ...transaction });
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch(`http://localhost:8000/transactions/${transaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...form, montant: parseFloat(form.montant) }),
      });

      if (response.ok) {
        if (typeof onUpdate === "function") onUpdate(); // 🔁 refresh global
        onClose();
      } else {
        const data = await response.json();
        setMessage(data.detail || "Erreur lors de la modification");
      }
    } catch (err) {
      setMessage("Erreur réseau");
    }
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>✏️ Modifier la transaction</h3>
        <form onSubmit={handleSubmit}>
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

          <div style={{ marginTop: "1rem" }}>
            <button type="submit">💾 Enregistrer</button>
            <button onClick={onClose} type="button" style={{ marginLeft: "1rem" }}>Annuler</button>
          </div>

          {message && <p style={{ color: "red", marginTop: "0.5rem" }}>{message}</p>}
        </form>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.4)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modal = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "8px",
  width: "100%",
  maxWidth: "500px"
};

const row = {
  marginBottom: "1rem",
  display: "flex",
  flexDirection: "column"
};
