import React from "react";
import { useUpdateDebtScreen } from "./useUpdateDebtScreen";
import DebtEntry from "../../components/molecules/DebtEntry";

export default function UpdateDebtScreen() {
  const updateDebtState = useUpdateDebtScreen();

  return (
    <DebtEntry
      type="Update"
      {...updateDebtState}
    />
  );
}
