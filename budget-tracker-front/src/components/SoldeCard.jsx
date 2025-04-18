import { useEffect, useState } from "react";

export default function SoldeCard({ onUpdate }) {
  const [solde, setSolde] = useState(null);     // solde affiché
  const [nouveauSolde, setNouveauSolde] = useState(""); // champ d'édition
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");


  // 🔁 Chargement du solde actuel depuis l’API
  useEffect(() => {
    const fetchSolde = async () => {
      try {
        const response = await fetch("http://localhost:8000/solde/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setSolde(data.montant);
          onUpdate(data.montant); // 👈 informe le parent
        } else {
          setMessage(data.detail || "Erreur lors du chargement du solde");
        }
      } catch (err) {
        setMessage("Erreur réseau");
      }
    };

    fetchSolde();
  }, [token, onUpdate]);

  // ✅ Mise à jour du solde via POST
  const handleUpdate = async () => {
    const montant = parseFloat(nouveauSolde);
    if (isNaN(montant) || montant < 0) {
      setMessage("Veuillez entrer un montant valide.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:8000/solde/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ montant }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setSolde(data.montant);
        onUpdate(data.montant);
        setMessage("✅ Solde mis à jour !");
        setNouveauSolde("");
      } else {
        setMessage(data.detail || "Erreur lors de la mise à jour");
      }
    } catch (err) {
      setMessage("Erreur réseau");
    }
  };
  


  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      background: "#f9f9f9"
    }}>
      <h3>💰 Solde actuel : {solde !== null ? `${solde.toFixed(2)} €` : "..."}</h3>

      <div style={{ marginTop: "1rem" }}>
        <input
          type="number"
          step="0.01"
          placeholder="Nouveau solde"
          value={nouveauSolde}
          onChange={(e) => setNouveauSolde(e.target.value)}
        />
        <button onClick={handleUpdate} style={{ marginLeft: "1rem" }}>
          Actualiser le solde
        </button>
      </div>

      {message && <p style={{ marginTop: "0.5rem", color: "#555" }}>{message}</p>}
    </div>
  );
}
