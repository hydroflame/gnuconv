import React, { useState } from "react";
import { Box } from "@mui/material";
import { Header } from "./Header";
import { ConvertPage } from "./Convert";
import { RulesPage } from "./Rule";

interface transaction {
  account: string;
  date: string;
  description: string;
  destination: string;
  amount: number;
}

interface File {
  AccountName: string;
  Transactions: transaction[];
}

export const App = (): React.ReactElement => {
  const [page, setPage] = useState("RBC");

  const C = ((): React.ReactElement => {
    if (page === "RBC") return <ConvertPage />;
    if (page === "RULES") return <RulesPage />;
    return <></>;
  })();
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <Header setPage={setPage} />
      {C}
    </Box>
  );
};
