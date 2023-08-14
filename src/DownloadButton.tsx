import React from "react";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import { transaction } from "./Convert";

interface IProps {
  AccountName: string;
  Transactions: transaction[];
}

interface GNULine {
  date: string;
  description: string;
  destination: string;
  amount: number;
  namount: number;
}

export const DownloadButton = ({
  AccountName,
  Transactions,
}: IProps): React.ReactElement => {
  const lines = Transactions.map((t) => {
    return {
      date: t.date,
      description: t.description,
      destination: t.destination,
      amount: t.amount > 0 ? t.amount : 0,
      namount: t.amount < 0 ? -t.amount : 0,
    };
  });
  const onClick = () => {
    const csvs = Papa.unparse(lines, { header: false });
    var blob = new Blob([csvs], {
      type: "text/plain",
    });
    saveAs(blob, `${AccountName}.csv`);
  };
  return <Button onClick={onClick}>{AccountName}</Button>;
};
