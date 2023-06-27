import { useState, useEffect } from "react";
import { createStyles, Text, Button, Center } from "@mantine/core";
import StaffInfo from "../../components/staff/StaffInfo";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../functionsToCallAPI/fetcher"

const useStyles = createStyles((theme) => ({}));

export default function staffDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useSWR(
    `http://localhost:8001/api/staff/${id}`,
    fetcher
  );

  return (
    <Layout>
      {isLoading ? (
        <Center>
          <Text>Loading...</Text>
        </Center>
      ) : (
        <StaffInfo headerTitle="Staff" mode="update" id={id} staff={data} />
      )}
    </Layout>
  );
}
