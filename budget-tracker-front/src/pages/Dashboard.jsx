import Header from "../components/Header";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [erreur, setErreur] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setErreur("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/transactions/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setTransactions(data);
        } else {
          setErreur(data.detail || "Erreur lors du chargement des transactions");
        }
      } catch (err) {
        setErreur("Erreur réseau");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <>
        <Header />
        <div style={{ padding: "2rem" }}>
        <h2>Dashboard</h2>

        {loading && <p>Chargement...</p>}

        {erreur && <p style={{ color: "red" }}>{erreur}</p>}

        {!loading && transactions.length === 0 && !erreur && (
            <p>Aucune transaction trouvée.</p>
        )}

        {transactions.length > 0 && (
            <ul>
            {transactions.map((t) => (
                <li key={t.id}>
                {t.date} — {t.description} — {t.montant}€ — {t.statut}
                </li>
            ))}
            </ul>
        )}
        </div>
    </>
  );
}
