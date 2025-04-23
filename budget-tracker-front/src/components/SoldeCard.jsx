import { useEffect, useState } from "react";

export default function SoldeCard({ onUpdate }) {
  const [solde, setSolde] = useState(null);
  const [montant, setMontant] = useState("");
  const token = localStorage.getItem("token");

  const fetchSolde = async () => {
    try {
      const response = await fetch("http://localhost:8000/solde/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setSolde(data.montant);
        if (typeof onUpdate === "function") onUpdate(data.montant);
      }
    } catch (err) {
      console.error("Erreur chargement solde");
    }
  };

  useEffect(() => {
    fetchSolde();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/solde/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ montant: parseFloat(montant) }),
      });

      if (response.ok) {
        setMontant("");
        fetchSolde(); // rafraîchir l'affichage local
      } else {
        console.error("Erreur mise à jour du solde");
      }
    } catch (err) {
      console.error("Erreur réseau mise à jour solde");
    }
  };

  return (
    <div className="card card-green">
      <div className="card-icon">💰</div>
      <div style={{ flexGrow: 1 }}>
        <div className="card-label">Solde actuel</div>
        <div className="card-value">{solde !== null ? `${solde.toFixed(2)} €` : "..."}</div>

        {/* Formulaire intégré */}
        <form onSubmit={handleUpdate} style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
          <input
            type="number"
            step="0.01"
            placeholder="Nouveau solde"
            value={montant}
            onChange={(e) => setMontant(e.target.value)}
            required
          />
          <button type="submit">Actualiser</button>
        </form>
      </div>
    </div>
  );
}
