import { useState, useEffect } from "react";
import { createStyles, Text, Button } from "@mantine/core";
import NewInvoice from "../components/invoices/NewInvoice";
import Layout from "../components/Layout";
import fetcher from "../../functionsToCallAPI/fetcher";
import useSWR from "swr";

const useStyles = createStyles((theme) => ({}));

export default function addTeacher() {
  const { data, error, isLoading } = useSWR(
    "http://localhost:8001/api/fee/all",
    fetcher
  );
  return (
    <Layout>
      <NewInvoice title="Invoice"  mode="New Entry" fee={data} />
    </Layout>
  );
}
