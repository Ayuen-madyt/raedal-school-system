import { useState, useEffect } from "react";
import { createStyles, Text, Button } from "@mantine/core";
import NewStaff from "../components/staff/NewStaff";
import Layout from "../components/Layout";

const useStyles = createStyles((theme) => ({}));

export default function addTeacher() {
  return (
    <Layout>
      <NewStaff title="Staff"  mode="New Entry"/>
    </Layout>
  );
}
