import React, { useState } from "react";
import Layout from "../components/Layout";
import CommonTable from "../components/common/CommonTable";
import fetcher from "../../functionsToCallAPI/fetcher";
import useSWR from "swr";
import { formatNumber } from "../components/common/formatNumber.js";
import {
  createStyles,
  Header,
  Group,
  rem,
  Button,
  Title,
  TextInput,
  Modal,
  useMantineTheme,
  Flex,
  Select,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import lunr from "lunr";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginTop: 5,
    position: "sticky",
  },

  inner: {
    height: rem(56),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  search: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },
}));

function Balances() {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [studentClass, setStudentClass] = useState("");
  const [term, setTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const { data, error } = useSWR(
    "http://localhost:8001/api/balances/all",
    fetcher
  );

  const formattedData =
    filteredData?.length > 0
      ? filteredData.map((balance) => ({
          _id: balance._id,
          party: balance.party,
          partyClass: balance.partyClass,
          date: new Date(balance.date).toLocaleDateString(),
          partyAdmNo: balance.partyAdmNo,
          term: balance.term.term,
          balance: `${localStorage.getItem("currency")} ${formatNumber(
            balance.balance
          )}`,
          overPaidBalance: `${localStorage.getItem("currency")} ${formatNumber(
            Math.abs(balance.overPaidBalance)
          )}`,
        }))
      : data?.map((balance) => ({
          _id: balance._id,
          party: balance.party,
          partyClass: balance.partyClass,
          date: new Date(balance.date).toLocaleDateString(),
          partyAdmNo: balance.partyAdmNo,
          term: balance.term.term,
          balance: `${localStorage.getItem("currency")} ${formatNumber(
            balance.balance
          )}`,
          overPaidBalance: `${localStorage.getItem("currency")} ${formatNumber(
            Math.abs(balance.overPaidBalance)
          )}`,
        }));

  const index = lunr(function () {
    this.ref("_id");
    this.field("_id");
    this.field("party");
    this.field("partyClass");
    this.field("date");
    this.field("partyAdmNo");
    this.field("term");

    formattedData?.forEach((item) => {
      this.add(item);
    });
  });

  const columns = [
    { label: "Adm No", dataKey: "partyAdmNo" },
    { label: "Party", dataKey: "party" },
    { label: "Class", dataKey: "partyClass" },
    { label: "Date", dataKey: "date" },
    { label: "Term", dataKey: "term" },
    { label: "Balance", dataKey: "balance" },
    { label: "Amount Overpaid", dataKey: "overPaidBalance" },
  ];

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
    } else if (index) {
      const results = index.search(term);

      const matchedItems = results
        .map((result) => {
          const item = formattedData?.find(
            (dataItem) => dataItem._id === parseInt(result.ref)
          );
          if (item) {
            return item;
          }
          return null;
        })
        .filter(Boolean);

      setSearchResults(matchedItems);
    }
  };

  const filter = () => {
    const data = { studentClass, term };
    if (data) {
      axios
        .get("http://localhost:8001/api/balances/filter", {
          params: {
            studentClass,
            term,
          },
        })
        .then((res) => {
          setStudentClass("");
          setTerm("");
          setFilteredData(res.data);
          close();
        })
        .catch((err) => {
          setStudentClass("");
          setTerm("");
          close();
        });
    }
  };

  return (
    <Layout>
      <Header className={classes.header} mb={10}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>Balances</Title>
          </Group>

          <Group>
            <TextInput
              icon={<IconSearch size="1.1rem" stroke={1.5} />}
              radius="md"
              size="sm"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search balances"
            />
            <Group ml={5} spacing={5} className={classes.links}>
              <CSVLink
                filename={"balances.csv"}
                data={
                  filteredData?.length > 0
                    ? filteredData
                    : searchResults?.length > 0
                    ? searchResults
                    : formattedData?.length > 0
                    ? formattedData
                    : []
                }
              >
                <Button style={{ backgroundColor: "#47d6ab", color: "white" }}>
                  Export
                </Button>
              </CSVLink>
              <Button
                onClick={open}
                style={{ backgroundColor: "#47d6ab", color: "white" }}
              >
                Filter
              </Button>
            </Group>
          </Group>
        </div>
      </Header>

      <Modal
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        styles={(theme) => ({
          content: {
            height: "100%",
          },
        })}
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size="fit-content"
      >
        <Flex
          mih={50}
          gap="md"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
          mb="md"
        >
          <Select
            label="Filter by Class/Form"
            placeholder="Pick class"
            onChange={setStudentClass}
            data={[
              { value: 1, label: "1" },
              { value: 2, label: "2" },
              { value: 3, label: "3" },
              { value: 4, label: "4" },
              { value: 5, label: "5" },
              { value: 6, label: "6" },
              { value: 7, label: "7" },
              { value: 8, label: "8" },
            ]}
          />
          <Select
            label="Filter by term"
            placeholder="Pick term"
            onChange={setTerm}
            data={[
              { value: "term 1", label: "Term 1" },
              { value: "term 2", label: "Term 2" },
              { value: "term 3", label: "Term 3" },
            ]}
          />
        </Flex>

        <Button
          mt="md"
          onClick={filter}
          style={{ backgroundColor: "#47d6ab", color: "white", width: "100%" }}
        >
          Apply filter
        </Button>
      </Modal>

      <CommonTable
        data={searchResults.length > 0 ? searchResults : formattedData}
        columns={columns}
        title="Balances"
      />
    </Layout>
  );
}

export default Balances;
