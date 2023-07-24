import Layout from "../components/Layout";
import { useState, useEffect, Fragment, useRef } from "react";
import {
  createStyles,
  Text,
  Button,
  Paper,
  Flex,
  Center,
  Title,
  Badge,
  ScrollArea,
  Select,
  Group,
  Header,
  rem,
  Loader,
  Divider,
  Alert,
} from "@mantine/core";
import { IconPlus, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../functionsToCallAPI/fetcher";
import { formatNumber } from "../components/common/formatNumber";

const useStyles = createStyles((theme) => ({
  studentContainer: {
    width: "60%",
    boxShadow: `0px 6px 16px rgba(0, 0, 0, 0.1)`,
    marginTop: 20,
  },
  // header search
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginTop: 5,
  },

  inner: {
    height: rem(45),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
  text: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 400,
  },
  title: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 450,
    fontSize: 17,
  },
  term: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[1],
    },
    padding: 10,
  },
}));

export default function Fees({ title, mode }) {
  const { classes } = useStyles();
  const scrollAreaRef = useRef(null);
  const router = useRouter();

  const { data, error } = useSWR("http://localhost:8001/api/fee/all", fetcher);

  const newFee = (event) => {
    event.preventDefault();
    router.push("/addFee");
  };

  useEffect(() => {
    const resizeScrollArea = () => {
      const scrollArea = scrollAreaRef.current;
      if (scrollArea) {
        const windowHeight = window.innerHeight;
        const scrollAreaTop = scrollArea.getBoundingClientRect().top;
        const scrollAreaHeight = windowHeight - scrollAreaTop;
        scrollArea.style.height = `${scrollAreaHeight}px`;
      }
    };

    window.addEventListener("resize", resizeScrollArea);
    resizeScrollArea();

    return () => {
      window.removeEventListener("resize", resizeScrollArea);
    };
  }, []);

  console.log("data here: ", data);

  return (
    <Layout>
      {/* header options */}
      <Header className={classes.header}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>Fees</Title>
          </Group>

          <Group>
            <Group ml={5} spacing={5} className={classes.links}>
              <Button onClick={newFee} color="info" compact>
                <IconPlus />
              </Button>

              <Button
                compact
                style={{ backgroundColor: "#47d6ab", color: "white" }}
                onClick={() => router.back()}
              >
                <IconArrowLeft />
              </Button>
            </Group>
          </Group>
        </div>
      </Header>
      {/* end header options */}
      <Center>
        <Paper
          radius="md"
          withBorder
          className={classes.studentContainer}
          p="md"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
            overflow: "hidden",
            maxHeight: "calc(100vh - 20px)",
          })}
        >
          <Flex
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
            style={{
              paddingBottom: "10px",
            }}
          >
            <Title style={{ fontSize: "15px" }}>Fee Structure</Title>
            <Badge></Badge>
          </Flex>
          <Divider />
          <ScrollArea
            mt="md"
            ref={scrollAreaRef}
            style={{ width: "100%", overflow: "auto" }}
          >
            {data?.map((data) => (
              <Paper
                key={data._id}
                className={classes.term}
                onClick={() => router.push(`/feeDetails/${data._id}`)}
              >
                <Title className={classes.title}>
                  {data.term.toUpperCase()}
                </Title>
                <Divider mt="sm" />
                {data.fields.map((field) => (
                  <Flex
                    key={field.label}
                    mt="xs"
                    gap="md"
                    justify="space-between"
                    align="center"
                    direction="row"
                    wrap="wrap"
                    style={{ paddingRight: 50, paddingLeft: 50 }}
                  >
                    <Text className={classes.text}>{field.label}</Text>
                    <Text className={classes.text}>
                      {formatNumber(field?.amount)}
                    </Text>
                  </Flex>
                ))}

                <Flex
                  mt="xs"
                  gap="md"
                  justify="flex-end"
                  align="center"
                  direction="row"
                  wrap="wrap"
                  style={{ paddingRight: 50, paddingLeft: 50 }}
                >
                  <Text>Total</Text>
                  <Text>{`${localStorage.getItem("currency")} ${formatNumber(
                    data.total
                  )}`}</Text>
                </Flex>
              </Paper>
            ))}
          </ScrollArea>
          <Divider style={{ marginTop: -20 }} />
        </Paper>
      </Center>
    </Layout>
  );
}
