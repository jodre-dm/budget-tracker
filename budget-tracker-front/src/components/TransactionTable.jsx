import { useEffect, useState } from "react";

export default function TransactionTable({ type, refresh, onUpdate }) {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState("");
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
  }, [token, type, refresh]); // 🔁 se met à jour automatiquement

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
        if (typeof onUpdate === "function") onUpdate(); // 🔁 déclenche le refresh global
      } else {
        alert("Erreur lors de la mise à jour du statut");
      }
    } catch (err) {
      alert("Erreur réseau");
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>{type === "récurrente" ? "🔁 Transactions récurrentes" : "💸 Transactions ponctuelles"}</h3>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={th}>Date</th>
            <th style={th}>Description</th>
            <th style={th}>Montant</th>
            <th style={th}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
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
            </tr>
          ))}
        </tbody>
      </table>
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
