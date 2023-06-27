import Layout from "../Layout";
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
  Image,
  Box,
  TextInput,
  ScrollArea,
  Select,
  Group,
  Header,
  rem,
  Loader,
  Divider,
  Alert,
} from "@mantine/core";
import { IconAlertCircle, IconTrash, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import axios from "axios";
import { formatNumber } from "../common/formatNumber";

const useStyles = createStyles((theme) => ({
  studentContainer: {
    width: "55%",
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
  input: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 400,
  },
  label: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 400,
  },
}));

export default function FeeInfo({ title, data }) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const router = useRouter();

  const deleteFee = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:8001/api/fee/delete/${data?._id}`)
      .then((res) => {
        setTimeout(() => {
          setLoading(false);
          router.push("/fees");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
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


  return (
    <Fragment>
      {/* header options */}
      <Header className={classes.header}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>{title}</Title>
          </Group>

          <Group>
            <Group ml={5} spacing={5} className={classes.links}>
              <Button color="red" compact onClick={deleteFee}>
                {loading ? (
                  <Loader color="white" inline size="xs" />
                ) : (
                  <IconTrash />
                )}
              </Button>
              <Button
                compact
                style={{ backgroundColor: "#e8e9fa", color: "grey" }}
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
            <Title style={{ fontSize: "15px" }}>{`${data?.term} fee`}</Title>
            <Badge></Badge>
          </Flex>
          <Divider />
          <ScrollArea
            mt="md"
            ref={scrollAreaRef}
            style={{ width: "100%", overflow: "auto" }}
          >
            <TextInput
              label="Term"
              placeholder="Choose term"
              value={data?.term}
              styles={{
                input: classes.input,
                label: classes.label,
              }}
              mb="md"
            />

            <Flex mt="md"
              mb="md"
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap">
              <Select
                label="Term start date"
                placeholder="Term start date"
                required
                value={data?.termStartDate}
                data={[
                  { value: 0, label: "January" },
                  { value: 1, label: "February" },
                  { value: 2, label: "March" },
                  { value: 3, label: "April" },
                  { value: 4, label: "May" },
                  { value: 5, label: "June" },
                  { value: 6, label: "July" },
                  { value: 7, label: "August" },
                  { value: 8, label: "September" },
                  { value: 9, label: "October" },
                  { value: 10, label: "November" },
                  { value: 11, label: "December" },
                ]}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
                w={250}
              />
              <Select
                label="Term end date"
                placeholder="Term end date"
                required
                value={data?.termEndDate}
                data={[
                  { value: 0, label: "January" },
                  { value: 1, label: "February" },
                  { value: 2, label: "March" },
                  { value: 3, label: "April" },
                  { value: 4, label: "May" },
                  { value: 5, label: "June" },
                  { value: 6, label: "July" },
                  { value: 7, label: "August" },
                  { value: 8, label: "September" },
                  { value: 9, label: "October" },
                  { value: 10, label: "November" },
                  { value: 11, label: "December" },
                ]}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
                w={250}
              />
            </Flex>

            {data?.fields?.map((field) => (
              <Paper
                key={field.label}
                style={{ marginBottom: "5px", padding: "5px" }}
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
                  <TextInput
                    w={250}
                    value={field.label}
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                  <TextInput
                    w={250}
                    type="number"
                    value={field.amount}
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Flex>
              </Paper>
            ))}
            <Flex
              gap="md"
              justify="flex-end"
              align="center"
              direction="row"
              wrap="wrap"
              mb="md"
            >
              <TextInput
                w={250}
                label="Grand Total"
                type="number"
                variant="filled"
                value={data?.total}
              />
            </Flex>
          </ScrollArea>
          <Divider style={{ marginTop: -20 }} />
        </Paper>
      </Center>
    </Fragment>
  );
}
