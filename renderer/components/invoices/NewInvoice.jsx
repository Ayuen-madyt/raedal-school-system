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
import useSWR from "swr";
import fetcher from "../../../functionsToCallAPI/fetcher";
import axios from "axios";
import { useForm, isNotEmpty, isEmail } from "@mantine/form";
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

export default function NewInvoice({ title, mode, fee }) {
  const { classes } = useStyles();
  const [searchParty, setSearchPartyChange] = useState("");
  const[overPaidBalance, setOverPaidBalance] = useState(0);
  const [term, setTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const scrollAreaRef = useRef(null);
  const currentDate = new Date();
  const router = useRouter();

  const { data, error } = useSWR(
    "http://localhost:8001/api/students/all",
    fetcher
  );

  const newData = data?.map(({ firstName, secondName, _id }) => ({
    label: `${firstName} ${secondName}`,
    value: _id.toString(),
  }));

  const newFee = fee?.map(({ term, _id }) => ({
    label: term,
    value: _id.toString(),
  }));

  const filteredParty = data?.filter((student) => student._id == searchParty);
  const filteredFee = fee?.find((fee) => fee._id == term);

  const form = useForm({
    initialValues: {
      id: "",
      party: "",
      term: "",
      amount: "",
      notes: "",
      date: "",
    },
    validate: {
      party: isNotEmpty(),
      term: isNotEmpty(),
      amount: (value) => {
        if (isNaN(Number(value)) && isNotEmpty()) {
          return "Please enter a valid number";
        }
        return null;
      },
      notes: isNotEmpty(),
    },
    transformValues: (values) => {
      const overPaidBalanceValue = overPaidBalance.overPaidBalance !== undefined ? Number(overPaidBalance.overPaidBalance) : 0;
      return {
        id: "",
        party: filteredParty?.[0] || "",
        term: filteredFee,
        actualAmountPaid: Number(values.amount),
        amount: Number(values.amount) + overPaidBalanceValue,
        notes: values.notes,
        outstandingAmount: filteredFee?.total - (Number(values.amount) + overPaidBalanceValue),
        date: currentDate,
        status: "Paid",
      };
    },
  });

  const feeData = form.getTransformedValues();

  const postData = async () => {
    if (feeData.party && feeData.term && feeData.amount) {
      setLoading(true);
      try {
        // Post data to the first URL
        const response1 = await axios.post(
          `http://localhost:8001/api/invoices/post`,
          feeData
        );
  
        // Post data to the second URL
        const response2 = await axios.post(
          `http://localhost:8001/api/accounts/post`,
          feeData
        );
  
        // Check the responses and handle accordingly
        if (response1 && response2) {
          console.log("Response 1:", response1);
          console.log("Response 2:", response2);
          setTimeout(() => {
            setLoading(false);
            router.push("/invoices");
          }, 2000);
        }
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log("Error response data:", error.response.data);
          console.log("Error response status:", error.response.status);
          console.log("Error response headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.log("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an error
          console.log("Error message:", error.message);
        }
        console.log("Error config:", error.config);
      }
    } else {
      // Handle the case when the required data is not available
    }
  };  
  

  const handleBlur = () => {
    setShowSave(true);
  };

  useEffect(() => {
    if (searchParty) {
      axios
        .get(`http://localhost:8001/api/balances/${searchParty}`)
        .then((res) => {
          setOverPaidBalance(res.data)
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
  }, [searchParty]);

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
              {showSave && (
                <Button
                color="info"
                compact
                onClick={postData}
                disabled={loading}
              >
                {loading ? <Loader size="xs" /> : "Save"}
              </Button>
              )}
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
            <Title style={{ fontSize: "15px" }}>{mode}</Title>
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
                <Select
                  label="Party"
                  placeholder="Choose a student"
                  searchable
                  clearable
                  nothingFound="No options"
                  maxDropdownHeight={280}
                  value={searchParty}
                  onChange={setSearchPartyChange}
                  w={250}
                  onBlur={handleBlur}
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                  data={newData || []}
                  filter={(value, item) =>
                    item.label
                      .toLowerCase()
                      .includes(value.toLowerCase().trim()) ||
                    item.value.toLowerCase().includes(value.trim())
                  }
                />
                <Select
                  label="Term"
                  placeholder="Choose term "
                  clearable
                  searchable
                  nothingFound="No options"
                  maxDropdownHeight={280}
                  value={term}
                  onChange={setTerm}
                  w={250}
                  onBlur={handleBlur}
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                  data={newFee || []}
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
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                  {...form.getInputProps("amount")}
                  onBlur={handleBlur}
                />
                <DateInput
                  value={currentDate}
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
                {filteredParty && (
                  <>
                    <thead>
                      <tr>
                        <th style={{ fontWeight: 500, fontSize: "13px" }}>
                          Adm No
                        </th>
                        <th style={{ fontWeight: 500, fontSize: "13px" }}>
                          Name
                        </th>
                        <th style={{ fontWeight: 500, fontSize: "13px" }}>
                          Class
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: "1px solid #ddd" }}>
                        <td style={{ fontSize: "13px" }}>
                          {filteredParty[0]?._id}
                        </td>
                        <td
                          style={{ fontSize: "13px" }}
                        >{`${filteredParty[0]?.firstName} ${filteredParty[0]?.secondName}`}</td>
                        <td style={{ fontSize: "13px" }}>
                          {filteredParty[0]?.studentClass}
                        </td>
                      </tr>
                    </tbody>
                  </>
                )}
              </Table>
            </Box>
            <Divider style={{ marginTop: "-20px" }} />

            <Box mt="lg">
              <TextInput
                placeholder="Amount"
                label="Previous overpaid Amount"
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
                {...form.getInputProps("amount")}
               value={`Ksh ${overPaidBalance.overPaidBalance >0 ?formatNumber(overPaidBalance?.overPaidBalance): formatNumber(0)}`}
              />
            </Box>

            <Box mt="lg">
              <TextInput
                placeholder="Amount"
                label="Grand Total"
                value={`Ksh ${feeData.amount >0? formatNumber(feeData.amount): formatNumber(0)}`}
              />
            </Box>

            <Box style={{ marginTop: "20px", marginBottom:30 }}>
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
                placeholder="Add invoice terms"
                label="Notes"
                minRows={1}
                variant="filled"
                {...form.getInputProps("notes")}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
                onBlur={handleBlur}
              />
            </Box>
          </ScrollArea>
          <Divider style={{ marginTop: -20 }} />
        </Paper>
      </Center>
    </Fragment>
  );
}
