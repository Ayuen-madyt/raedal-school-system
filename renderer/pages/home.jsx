import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import Layout from '../components/Layout';
import { createStyles, Header, rem, Group, Button, Title, Paper, Box, Popover, Text, Flex } from '@mantine/core';
import { StatsGrid } from '../components/dashboard/StatsGrid';
import Chart from '../components/dashboard/Chart';
import { DateInput } from '@mantine/dates';
import fetcher from '../../functionsToCallAPI/fetcher';
import useSWR from 'swr'
import CommonTable from "../components/common/CommonTable"
import { formatNumber } from '../components/common/formatNumber';


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

export default function home() {
  const { classes } = useStyles();
  const [invoices, setInvoices] = useState([])

  const { data, error } = useSWR(
    "http://localhost:8001/api/invoices/all",
    fetcher
  );

  const totalAmountThisYear = invoices?.reduce((sum, invoice) => sum + invoice.amount, 0);
  const grandTotalAmount = data?.reduce((sum, invoice) => sum + invoice.amount, 0);

  const formattedData = data?.map((item) => ({
    _id: item._id,
    status: item.status,
    party: `${item.party.firstName} ${item.party.secondName}`,
    date: new Date(item.date).toLocaleDateString(),
    baseGrandTotal: `Ksh ${formatNumber(item.amount)}`,
    outstandingAmount: `Ksh ${formatNumber(item.outstandingAmount<0?0:item.outstandingAmount)}`,
  }));

  const columns = [
    { label: "Invoice No", dataKey: "_id" },
    { label: "Status", dataKey: "status" },
    { label: "Party", dataKey: "party" },
    { label: "Date", dataKey: "date" },
    { label: "Base Grand Total", dataKey: "baseGrandTotal" },
    { label: "Outstanding Amount", dataKey: "outstandingAmount" },
  ];

  useEffect(() => {
    const filteredInvoices = data?.filter((invoice) => {
      const invoiceYear = new Date(invoice.date).getFullYear();
      return invoiceYear === new Date().getFullYear();
    });
    setInvoices(filteredInvoices)
  }, [data])

  return (
    <Layout>
      <Header className={classes.header} mb={10}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>Dashboard</Title>
          </Group>

          <Group>
            <Group ml={5} spacing={5} className={classes.links}>
              
            </Group>
          </Group>
        </div>
      </Header>
      <Paper px="md">
        <StatsGrid grandTotalAmount={grandTotalAmount} totalAmountThisYear={totalAmountThisYear} />
        <Text mt="sm">Recent invoices</Text>
        <CommonTable data={formattedData?.slice(0, 20)} columns={columns}/>
      </Paper>
    </Layout>
  )
}
