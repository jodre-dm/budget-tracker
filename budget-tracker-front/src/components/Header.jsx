import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [prenom, setPrenom] = useState("User");
  const [date, setDate] = useState("");

  useEffect(() => {
    const p = localStorage.getItem("prenom");
    if (p) setPrenom(p);

    const dateStr = new Date().toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
    setDate(dateStr);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <div className="header-top">
        <div className="menu-icon">☰</div>
        <div className="avatar" onClick={handleLogout} title="Déconnexion">
          {prenom[0].toUpperCase()}
        </div>
      </div>

      <div className="header-bar">
        <div className="header-date">{date}</div>
        <div className="header-user">Bonjour {prenom}</div>
      </div>
    </>
  );
}
