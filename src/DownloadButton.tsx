import React from "react";
import { transaction } from "./App";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import Papa from "papaparse";

interface IProps {
  AccountName: string;
  Transactions: transaction[];
}

export const DownloadButton = ({
  AccountName,
  Transactions,
}: IProps): React.ReactElement => {
  const onClick = () => {
    const lines = Papa.unparse(Transactions, { header: false });
    var blob = new Blob([lines], {
      type: "text/plain",
    });
    saveAs(blob, `${AccountName}.csv`);
  };
  return <Button onClick={onClick}>{AccountName}</Button>;
};
