import { useState, useEffect } from "react";
import { createStyles, Text, Button } from "@mantine/core";
import NewTeacher from "../components/teacher/NewTeacher";
import Layout from "../components/Layout";

const useStyles = createStyles((theme) => ({}));

export default function addTeacher() {
  return (
    <Layout>
      <NewTeacher title="Teacher"  mode="New Entry"/>
    </Layout>
  );
}
