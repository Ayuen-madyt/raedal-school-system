import { useState, useEffect } from "react";
import { createStyles, Text, Button, Center } from "@mantine/core";
import StudentInfo from "../../components/student/StudentInfo";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../functionsToCallAPI/fetcher"

const useStyles = createStyles((theme) => ({}));

export default function studentDetails() {
  const router = useRouter();
  const { id } = router.query;
  console.log(id);

  const { data, error, isLoading } = useSWR(
    `http://localhost:8001/api/students/${id}`,
    fetcher
  );

  console.log("data here", data);
  return (
    <Layout>
      {isLoading ? (
        <Center>
          <Text>Loading...</Text>
        </Center>
      ) : (
        <StudentInfo title="Student" mode="update" id={id} student={data} />
      )}
    </Layout>
  );
}
