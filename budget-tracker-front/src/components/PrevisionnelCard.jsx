import { useEffect, useState } from "react";

export default function PrevisionnelCard({ solde, refresh }) {
  const [previsionnel, setPrevisionnel] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPrevisionnel = async () => {
      try {
        const response = await fetch("http://localhost:8000/transactions/previsionnel", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.ok) {
          setPrevisionnel(data.previsionnel); // ✅ c’est déjà la valeur attendue
        }
      } catch (err) {
        console.error("Erreur previsionnel");
      }
    };
  
    fetchPrevisionnel();
  }, [solde, refresh]);
  
  return (
    <div className="card card-blue">
      <div className="card-icon">📉</div>
      <div>
        <div className="card-label">Prévisionnel</div>
        <div className="card-value">{previsionnel !== null ? `${previsionnel.toFixed(2)} €` : "..."}</div>
      </div>
    </div>
  );
}
