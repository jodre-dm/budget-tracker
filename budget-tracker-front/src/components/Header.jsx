import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const date = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <>
      {/* Bandeau bleu */}
      <div style={{
        backgroundColor: "#3F51B5",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.75rem 1rem"
      }}>
        {/* Menu hamburger (non fonctionnel pour l'instant) */}
        <div style={{ fontSize: "1.5rem", cursor: "pointer" }}>☰</div>

        {/* Avatar cliquable = déconnexion */}
        <div
          onClick={handleLogout}
          title="Déconnexion"
          style={{
            width: "35px",
            height: "35px",
            borderRadius: "50%",
            backgroundColor: "#f5f5f5",
            color: "#3F51B5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
            cursor: "pointer"
          }}
        >
          U
        </div>
      </div>

      {/* Barre blanche en-dessous */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        backgroundColor: "#fff",
        borderBottom: "1px solid #ddd"
      }}>
        <div style={{ fontSize: "0.9rem" }}>{date}</div>
        <div style={{ fontWeight: "500" }}>
            Bonjour {localStorage.getItem("prenom") || "User"}
        </div>
      </div>
    </>
  );
}
