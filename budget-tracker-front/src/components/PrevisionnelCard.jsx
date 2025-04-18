import { useEffect, useState } from "react";

export default function PrevisionnelCard({ solde, refresh }) {
  const [previsionnel, setPrevisionnel] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPrevisionnel = async () => {
      try {
        const response = await fetch("http://localhost:8000/transactions/previsionnel", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setPrevisionnel(data.previsionnel);
        } else {
          setMessage(data.detail || "Erreur lors du calcul");
        }
      } catch (err) {
        setMessage("Erreur réseau");
      }
    };

    fetchPrevisionnel();
  }, [token, solde, refresh]);

  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      background: "#fffbe6"
    }}>
      <h3>📉 Solde prévisionnel</h3>
      {previsionnel !== null ? (
        <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
          {previsionnel.toFixed(2)} €
        </p>
      ) : (
        <p>Chargement...</p>
      )}
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
