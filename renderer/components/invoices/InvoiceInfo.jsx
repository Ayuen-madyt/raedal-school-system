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
  Textarea,
  Table,
  Alert,
} from "@mantine/core";
import { IconAlertCircle, IconTrash, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { DateInput } from "@mantine/dates";
import { formatNumber } from "../common/formatNumber";
import axios from "axios";

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

export default function InvoiceInfo({ title, invoice }) {
  const { classes } = useStyles();
  const [waitingDelete, setWaitingDelete] = useState(false);
  const scrollAreaRef = useRef(null);
  const router = useRouter();

  const deleteInvoice = () => {
    setWaitingDelete(true);
    axios
      .delete(`http://localhost:8001/api/invoices/delete/${invoice?._id}`)
      .then((res) => {
        setTimeout(() => {
          setWaitingDelete(false);
          router.push("/invoices");
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

  console.log(invoice);

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
              <Button onClick={deleteInvoice} color="red" compact disabled={waitingDelete}>
                {waitingDelete ? (
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
            <Title style={{ fontSize: "15px" }}>{invoice?._id}</Title>
            <Badge></Badge>
          </Flex>
          <Divider />
          <ScrollArea
            mt="md"
            ref={scrollAreaRef}
            style={{ width: "100%", overflow: "auto" }}
          >
            <Box>
              <Flex
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <TextInput
                  label="Party"
                  placeholder="Choose a student"
                  value={`${invoice?.party.firstName} ${invoice?.party.secondName} ${invoice?.party.lastName}`}
                  w={250}
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                />
                <TextInput
                  label="Term"
                  placeholder="Choose term "
                  value={invoice?.term.term}
                  w={250}
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                />
              </Flex>
              <Flex
                mt="md"
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <TextInput
                  w={250}
                  placeholder="Amount"
                  label="Amount"
                  value={`KSh ${formatNumber(invoice?.actualAmountPaid)}`}
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                />
                <DateInput
                  value={invoice?.date && new Date(invoice?.date)}
                  w={250}
                  valueFormat="YYYY MMM DD"
                  label="Date"
                  placeholder="Date input"
                  maw={400}
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                />
              </Flex>
            </Box>
            <Divider style={{ marginTop: "20px" }} />

            <Box mt="xl">
              <Title style={{ fontSize: "13.5px", color: "grey" }}>
                Debtor
              </Title>
              <Table
                style={{
                  borderCollapse: "separate",
                  borderSpacing: "0 5px",
                  marginBottom: "20px",
                }}
              >
                {invoice && (
                  <>
                    <thead>
                      <tr>
                        <th style={{ fontWeight: 500, fontSize: "14px" }}>
                          Adm No
                        </th>
                        <th style={{ fontWeight: 500, fontSize: "14px" }}>
                          Name
                        </th>
                        <th style={{ fontWeight: 500, fontSize: "14px" }}>
                          Class
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ fontSize: "14px" }}>
                          {invoice.party._id}
                        </td>
                        <td
                          style={{ fontSize: "14px" }}
                        >{`${invoice?.party.firstName} ${invoice?.party.secondName}  ${invoice?.party.lastName}`}</td>
                        <td style={{ fontSize: "14px" }}>
                          {invoice?.party.studentClass}
                        </td>
                      </tr>
                    </tbody>
                  </>
                )}
              </Table>
            </Box>
            <Divider style={{ marginTop: "-20px" }} />
            {invoice?.outstandingAmount < 0 ? (
              <TextInput
                mt="xl"
                placeholder="Previous overpaid Amount"
                label="Previous overpaid Amount"
                value={`KSh ${formatNumber(Math.abs(invoice?.outstandingAmount))}`}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
              />
            ) : (
              <TextInput
                mt="xl"
                placeholder="Outstanding Amount"
                label="Outstanding Amount"
                value={`KSh ${formatNumber(invoice?.outstandingAmount)}`}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
              />
            )}
            <Box mt="lg">
              <TextInput
                placeholder="Amount"
                label="Base Grand Total"
                value={`Ksh ${invoice?.amount}`}
                variant="filled"
              />
            </Box>
            <Box style={{ marginTop: "30px", marginBottom:30 }}>
              <Title
                style={{
                  fontSize: "13.5px",
                  color: "grey",
                  marginBottom: "10px",
                }}
              >
                References
              </Title>
              <Textarea
                placeholder="Invoice terms"
                variant="filled"
                minRows={1}
                value={invoice?.notes}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
              />
            </Box>
          </ScrollArea>
          <Divider style={{ marginTop: -20 }} />
        </Paper>
      </Center>
    </Fragment>
  );
}
