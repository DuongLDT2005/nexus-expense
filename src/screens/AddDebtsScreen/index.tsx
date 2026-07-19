import React from "react";
import { useAddDebtsScreen } from "./useAddDebtsScreen";
import DebtEntry from "../../components/molecules/DebtEntry";

export default function AddDebtsScreen() {
  const addDebtsState = useAddDebtsScreen();

  return (
    <DebtEntry
      type="Add"
      {...addDebtsState}
    />
  );
}
