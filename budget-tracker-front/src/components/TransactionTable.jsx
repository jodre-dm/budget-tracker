import { useEffect, useState } from "react";
import EditTransactionModal from "./EditTransactionModal";

export default function TransactionTable({ type, refresh, onUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
  const [edition, setEdition] = useState(null);
  const [tri, setTri] = useState("date");
  const [ordre, setOrdre] = useState("desc");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`http://localhost:8000/transactions?type=${type}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
        } else {
          setMessage(data.detail || "Erreur lors du chargement");
        }
      } catch (err) {
        setMessage("Erreur réseau");
      }
    };

    fetchTransactions();
  }, [token, type, refresh]);

  const handleToggleStatut = async (id, currentStatut) => {
    const nouveauStatut = currentStatut === "prélevé" ? "en attente" : "prélevé";

    try {
      const response = await fetch(`http://localhost:8000/transactions/${id}/statut`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ statut: nouveauStatut }),
      });

      if (response.ok) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? { ...t, statut: nouveauStatut } : t))
        );
        if (typeof onUpdate === "function") onUpdate();
      } else {
        alert("Erreur lors de la mise à jour du statut");
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Supprimer cette transaction ?");
    if (!confirm) return;

    try {
      const response = await fetch(`http://localhost:8000/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        if (typeof onUpdate === "function") onUpdate();
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>{type === "récurrente" ? "🔁 Transactions récurrentes" : "💸 Transactions ponctuelles"}</h3>

      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Barre de tri */}
      <div style={{ marginBottom: "1rem" }}>
        <label>Trier par :</label>
        <select value={tri} onChange={(e) => setTri(e.target.value)} style={{ marginLeft: "0.5rem" }}>
          <option value="date">Date</option>
          <option value="montant">Montant</option>
          <option value="statut">Statut</option>
        </select>
        <button onClick={() => setOrdre(ordre === "asc" ? "desc" : "asc")} style={{ marginLeft: "1rem" }}>
          {ordre === "asc" ? "⬆️" : "⬇️"}
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={th}>Date</th>
            <th style={th}>Description</th>
            <th style={th}>Montant</th>
            <th style={th}>Statut</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[...transactions]
            .sort((a, b) => {
              let result = 0;

              if (tri === "date") {
                result = new Date(a.date) - new Date(b.date);
              } else if (tri === "montant") {
                result = a.montant - b.montant;
              } else if (tri === "statut") {
                result = a.statut.localeCompare(b.statut);
              }

              return ordre === "asc" ? result : -result;
            })
            .map((t) => (
              <tr key={t.id}>
                <td style={td}>{t.date}</td>
                <td style={td}>{t.description}</td>
                <td style={td}>{t.montant.toFixed(2)} €</td>
                <td style={td}>
                  <input
                    type="checkbox"
                    checked={t.statut === "prélevé"}
                    onChange={() => handleToggleStatut(t.id, t.statut)}
                  />
                </td>
                <td style={td}>
                  <button onClick={() => setEdition(t)}>✏️</button>
                  <button onClick={() => handleDelete(t.id)} style={{ marginLeft: "0.5rem" }}>🗑️</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Modale d'édition */}
      {edition && (
        <EditTransactionModal
          transaction={edition}
          onClose={() => setEdition(null)}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}

const th = {
  padding: "0.75rem",
  textAlign: "left",
  borderBottom: "1px solid #ccc",
};

const td = {
  padding: "0.75rem",
  borderBottom: "1px solid #eee",
};
