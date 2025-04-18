import { useState } from "react";
import Header from "../components/Header";
import SoldeCard from "../components/SoldeCard";
import PrevisionnelCard from "../components/PrevisionnelCard";
import AjouterTransactionForm from "../components/AjouterTransactionForm";
import TransactionTable from "../components/TransactionTable";

export default function Dashboard() {
  const [soldeActuel, setSoldeActuel] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0); // 🔁 un seul état partagé

  const forcerRefresh = () => {
    setRefreshCount((prev) => prev + 1); // 🔁 utilisé partout
  };

  return (
    <>
      <Header />
      <div style={{ padding: "1rem" }}>
        <SoldeCard onUpdate={setSoldeActuel} />
        <PrevisionnelCard solde={soldeActuel} refresh={refreshCount} />
        <AjouterTransactionForm onAjout={forcerRefresh} />
        <TransactionTable type="récurrente" refresh={refreshCount} onUpdate={forcerRefresh} />
        <TransactionTable type="ponctuelle" refresh={refreshCount} onUpdate={forcerRefresh} />
      </div>
    </>
  );
}
