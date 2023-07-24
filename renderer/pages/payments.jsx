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

function Payments() {
  const { classes } = useStyles();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const router = useRouter();
  const { data, error } = useSWR(
    "http://localhost:8001/api/payments/all",
    fetcher
  );

  const formattedData = data?.map((payment) => ({
    _id: payment._id,
    party: payment.party,
    amount: `${localStorage.getItem("currency")} ${payment.amount}`,
    date: new Date(payment.date).toLocaleDateString(),
    status: payment.status,
    partyAdmNo: payment.partyAdmNo,
  }));

  const index = lunr(function () {
    this.ref("_id");
    this.field("_id");
    this.field("amount");
    this.field("party");
    this.field("partyAdmNo");
    this.field("status");
    this.field("date");

    formattedData?.forEach((item) => {
      this.add(item);
    });
  });

  const columns = [
    { label: "Payment No", dataKey: "_id" },
    { label: "Status", dataKey: "status" },
    { label: "Party", dataKey: "party" },
    { label: "Posting Date", dataKey: "date" },
    { label: "Amount", dataKey: "amount" },
  ];

  return (
    <Layout>
      <Header className={classes.header} mb={10}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>Payments</Title>
          </Group>

          <Group>
            <Group ml={5} spacing={5} className={classes.links}>
              <CSVLink
                filename={"payments.csv"}
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
      <CommonTable data={formattedData} columns={columns} title="Payments" />
    </Layout>
  );
}

export default Payments;
