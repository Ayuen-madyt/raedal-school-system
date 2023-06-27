import { useState, useEffect } from "react";
import { createStyles, Text, Button } from "@mantine/core";
import NewStudent from "../components/student/NewStudent";
import Layout from "../components/Layout";

const useStyles = createStyles((theme) => ({}));

export default function addStudent() {
  return (
    <Layout>
      <NewStudent title="Student"  mode="New Entry"/>
    </Layout>
  );
}
