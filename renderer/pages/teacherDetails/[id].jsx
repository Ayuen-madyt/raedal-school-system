import { useState, useEffect } from "react";
import { createStyles, Text, Button, Center } from "@mantine/core";
import TeacherInfo from "../../components/teacher/TeacherInfo";
import Layout from "../../components/Layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../../functionsToCallAPI/fetcher"

const useStyles = createStyles((theme) => ({}));

export default function teacherDetails() {
  const router = useRouter();
  const { id } = router.query;

  const { data, error, isLoading } = useSWR(
    `http://localhost:8001/api/teachers/${id}`,
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
        <TeacherInfo headerTitle="Teacher" mode="update" id={id} teacher={data} />
      )}
    </Layout>
  );
}
