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
  Pagination,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import lunr from "lunr";
import { useRouter } from "next/router";
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

function Ledger() {
  const { classes } = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const { data, error } = useSWR(
    "http://localhost:8001/api/accounts/all",
    fetcher
  );

  const formattedData = data?.map((item) => ({
    _id: item._id,
    account: item.account,
    date: new Date(item.date).toLocaleDateString(),
    debit: `${localStorage.getItem("currency")} ${formatNumber(item.debit)}`,
    credit: `${localStorage.getItem("currency")} ${formatNumber(item.credit)}`,
    balance: `${localStorage.getItem("currency")} ${formatNumber(
      item.balance
    )}`,
    partyAdmNo: item.party._id,
    party: `${item.party.firstName} ${item.party.secondName}`,
    reference: item._id,
  }));

  const index = lunr(function () {
    this.ref("_id");
    this.field("_id");
    this.field("account");
    this.field("party");
    this.field("date");

    formattedData?.forEach((item) => {
      this.add(item);
    });
  });

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

          return item;
        })
        .filter(Boolean);

      setSearchResults(matchedItems);
    }
  };

  const columns = [
    { label: "Account", dataKey: "account" },
    { label: "Date", dataKey: "date" },
    { label: "Debit", dataKey: "debit" },
    { label: "Credit", dataKey: "credit" },
    { label: "Balance", dataKey: "balance" },
    { label: "Party", dataKey: "party" },
    { label: "Reference Id", dataKey: "reference" },
  ];

  return (
    <Layout>
      <Header className={classes.header} mb={10}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>General Ledger</Title>
          </Group>

          <Group>
            {/* <TextInput
              icon={<IconSearch size="1.1rem" stroke={1.5} />}
              radius="md"
              size="sm"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search the ledger"
            /> */}
            <Group ml={5} spacing={5} className={classes.links}>
              <CSVLink
                filename={"ledger.csv"}
                data={formattedData?.length > 0 ? formattedData : []}
              >
                <Button style={{ backgroundColor: "#47d6ab", color: "white" }}>
                  Export
                </Button>
              </CSVLink>
            </Group>
          </Group>
        </div>
      </Header>
      <CommonTable
        data={formattedData}
        columns={columns}
        title="General Ledger"
      />
    </Layout>
  );
}

export default Ledger;
