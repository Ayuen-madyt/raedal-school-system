import React, {useState} from "react";
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
} from "@mantine/core";
import { IconSearch, IconPlus} from "@tabler/icons-react";
import lunr from 'lunr';
import { useRouter } from "next/router";

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
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter()
  const { data, error } = useSWR(
    "http://localhost:8001/api/balances/all",
    fetcher
  );

  const formattedData = data?.map((balance) => ({
    _id: balance._id,
    party: balance.party,
    partyClass: balance.partyClass,
    date:new Date( balance.date).toLocaleDateString(),
    partyAdmNo: balance.partyAdmNo,
    term: balance.term.term,
    balance: `Ksh ${formatNumber(balance.balance)}`,
    overPaidBalance: `Ksh ${formatNumber(Math.abs(balance.overPaidBalance))}`,
  }));

  const index = lunr(function () {
    this.ref('_id');
    this.field('_id');
    this.field('party');
    this.field('partyClass');
    this.field('date');
    this.field('partyAdmNo');
    this.field('term');

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
  
    if (term.trim() === '') {
      setSearchResults([]);
    } else if (index) {
      const results = index.search(term);
  
      const matchedItems = results.map((result) => {
        const item = formattedData?.find((dataItem) => dataItem._id === parseInt(result.ref));
        if (item) {
          return item;
        }
        return null;
      }).filter(Boolean);
  
      setSearchResults(matchedItems);
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
              placeholder="Search questions"
            />
            <Group ml={5} spacing={5} className={classes.links}>
              <Button style={{ backgroundColor: "#47d6ab", color: "white" }}>
                Export
              </Button>
              <Button style={{ backgroundColor: "#47d6ab", color: "white" }}>
                Filter
              </Button>
            </Group>
          </Group>
        </div>
      </Header>
      <CommonTable data={searchResults.length > 0 ? searchResults : formattedData} columns={columns} title="Balances" />
    </Layout>
  );
}

export default Balances;

