import React, { useState } from "react";
import { Button } from "@mui/material";
import { DownloadButton } from "./DownloadButton";
import Papa from "papaparse";
import { Match, Rule } from "./Rule";

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

export const ConvertPage = (): React.ReactElement => {
  const [files, setFiles] = useState<File[]>([]);
  const rules = JSON.parse(localStorage.getItem("RULES") ?? "[]") as Rule[];
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const content = await file.text();
    const rows: string[][] = Papa.parse(content)
      .data.slice(1)
      .filter((c: any) => c.length > 1) as unknown as string[][];

    const transactions = rows.map(
      (r: any): transaction => ({
        account: r[1],
        date: r[2],
        description: r[4],
        destination: "Expenses:UNKNOWN",
        amount: parseFloat(r[6]),
      })
    );

    const matchDescription = (match: Match, transaction: transaction) =>
      match.description === undefined ||
      transaction.description.match(new RegExp(`${match.description}`, "g"));

    const matchAmount = (match: Match, transaction: transaction) =>
      match.amount === undefined || transaction.amount === match.amount;

    transactions.forEach((tr) => {
      rules.forEach(({ match, change }) => {
        if (!matchAmount(match, tr) || !matchDescription(match, tr)) return;
        if (change.description !== undefined)
          tr.description = change.description;
        if (change.destination !== undefined)
          tr.destination = change.destination;
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
  return (
    <>
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
    </>
  );
};
