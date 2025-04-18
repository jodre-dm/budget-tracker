export default function ResetStatutButton({ onReset }) {
    const token = localStorage.getItem("token");
  
    const handleClick = async () => {
      const confirm = window.confirm("Réinitialiser tous les statuts en 'en attente' ?");
      if (!confirm) return;
  
      try {
        const response = await fetch("http://localhost:8000/transactions/reset-statut", {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          if (typeof onReset === "function") onReset();
        } else {
          alert("Erreur lors de la réinitialisation");
        }
      } catch (err) {
        alert("Erreur réseau");
      }
    };
  
    return (
      <button onClick={handleClick} style={{ marginBottom: "1rem" }}>
        ♻️ Réinitialiser tous les statuts
      </button>
    );
  }
  