import React, { useState } from "react";
import "./App.css";
import { Box, Button, TextField } from "@mui/material";
import Papa from "papaparse";
import { DownloadButton } from "./DownloadButton";

export interface transaction {
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

interface Rule {
  match: string;
  destination: string;
}

function App() {
  const [files, setFiles] = useState<File[]>([]);
  const [rules, setRules] = useState(localStorage.getItem("RULES") ?? "[]");
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const content = await file.text();
    const parsedRules: Rule[] = JSON.parse(rules);
    const rows: string[][] = Papa.parse(content)
      .data.slice(1)
      .filter((c: any) => c.length > 1) as unknown as string[][];

    const transactions = rows.map(
      (r: any): transaction => ({
        account: r[1],
        date: r[2],
        description: r[4],
        destination: "UNKNOWN",
        amount: parseFloat(r[6]),
      })
    );

    transactions.forEach((tr) => {
      parsedRules.forEach((rule) => {
        const re = new RegExp(`${rule.match}`, "g");
        if (tr.description.match(re)) tr.destination = rule.destination;
      });
    });

    const accounts = Array.from(
      rows.reduce((p, c) => p.add(c[1]), new Set<string>())
    );
    setFiles(
      accounts.map((a) => ({
        AccountName: a,
        Transactions: transactions.filter((t) => t.account === a),
      }))
    );
  };

  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRules(event.target.value);
    localStorage.setItem("RULES", event.target.value);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <TextField multiline onChange={onChange} value={rules} />
      <Button variant="contained" component="label">
        CONVERT
        <input
          onChange={handleFileUpload}
          hidden
          accept="*.csv"
          multiple
          type="file"
        />
      </Button>
      {files.map((f) => (
        <DownloadButton
          key={f.AccountName}
          AccountName={f.AccountName}
          Transactions={f.Transactions}
        />
      ))}
    </Box>
  );
}

export default App;
