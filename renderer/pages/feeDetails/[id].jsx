import React from "react";
import Layout from "../../components/Layout";
import FeeInfo from "../../components/fee/FeeInfo";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../functionsToCallAPI/fetcher";

export default function feeDetails() {
    const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useSWR(
    `http://localhost:8001/api/fee/${id}`,
    fetcher
  );
  return (
    <Layout>
      <FeeInfo title="Fee"  data={data} />
    </Layout>
  );
}
