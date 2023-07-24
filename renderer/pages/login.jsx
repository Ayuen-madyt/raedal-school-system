import React, { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
  Loader,
} from "@mantine/core";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const login = () => {
    if (username && password) {
      setLoading(true);
      axios
        .post("http://localhost:8001/api/users/login", { username, password })
        .then((res) => {
          setTimeout(() => {
            setLoading(false);
            router.push("/home");
          }, 2000);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };
  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        RAEDAL SCHOOL MANAGEMENT SYSTEM
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        sign in to access accounting services{" "}
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <TextInput
          value={username}
          onChange={(event) => setUserName(event.currentTarget.value)}
          label="Usernme"
          placeholder="username"
          required
        />
        <PasswordInput
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
          label="Password"
          placeholder="Your password"
          required
          mt="md"
        />

        <Button
          color="teal"
          onClick={login}
          disabled={loading}
          fullWidth
          mt="xl"
        >
          {loading ? <Loader size="xs" /> : "Sign in"}
        </Button>
      </Paper>
    </Container>
  );
}
