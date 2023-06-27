import React from 'react'
import Layout from '../../components/Layout'
import InvoiceInfo from '../../components/invoices/InvoiceInfo'
import fetcher from '../../../functionsToCallAPI/fetcher';
import { useRouter } from "next/router";
import useSWR from "swr"

export default function invoiceDetails() {
  const router = useRouter()
  const { id } = router.query;

  const { data, error, isLoading } = useSWR(
    `http://localhost:8001/api/invoices/${id}`,
    fetcher
  );
  console.log("id invoice", data)
  return (
    <Layout>
      <InvoiceInfo title="Invoice" invoice={data} />
    </Layout>
  )
}
