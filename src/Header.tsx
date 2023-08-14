import React from "react";
import { AppBar, Button, Container, Toolbar } from "@mui/material";

interface IProps {
  setPage(v: string): void;
}

export const Header = ({ setPage }: IProps): React.ReactElement => {
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar>
          {["RBC", "RULES"].map((page) => (
            <Button
              key={page}
              onClick={() => setPage(page)}
              sx={{ my: 2, color: "white", display: "block" }}
            >
              {page}
            </Button>
          ))}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
