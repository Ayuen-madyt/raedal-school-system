import React, { useState } from "react";
import Layout from "../components/Layout";
import CommonTable from "../components/common/CommonTable";
import fetcher from "../../functionsToCallAPI/fetcher";
import useSWR from "swr";
import { formatNumber } from "../components/common/formatNumber.js";
import {
  createStyles,
  Header,
  Group,
  rem,
  Button,
  Title,
  TextInput,
  Modal,
  Select,
  useMantineTheme,
  Flex,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import lunr from "lunr";
import { useRouter } from "next/router";
import axios from "axios";
import { CSVLink, CSVDownload } from "react-csv";

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

function Students() {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [studentClass, setStudentClass] = useState("");
  const [status, setStatus] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const router = useRouter();
  const { data, error } = useSWR(
    "http://localhost:8001/api/students/all",
    fetcher
  );

  const index = lunr(function () {
    this.ref("_id");
    this.field("_id");
    this.field("firstName");
    this.field("secondName");
    this.field("studentEmail");
    this.field("town");
    this.field("lastName");
    this.field("state");
    this.field("parentEmail");
    this.field("studentPhone");
    this.field("studentClass");
    this.field("status");
    this.field("parentPhone");

    filteredData?.length > 0
      ? filteredData.forEach((item) => {
          this.add(item);
        })
      : data?.forEach((item) => {
          this.add(item);
        });
  });

  const columns = [
    { label: "Adm No", dataKey: "_id" },
    { label: "Name", dataKey: "fullName" },
    { label: "Class", dataKey: "studentClass" },
    { label: "Status", dataKey: "status" },
    { label: "Contact", dataKey: "studentPhone" },
    { label: "State/County", dataKey: "state" },
    { label: "City/Town", dataKey: "town" },
  ];

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
    } else if (index) {
      const results = index.search(term);

      const matchedItems = results
        .map((result) => {
          const item = data?.find(
            (dataItem) => dataItem._id === parseInt(result.ref)
          );
          if (item) {
            return item;
          }
          return null;
        })
        .filter(Boolean);

      setSearchResults(matchedItems);
    }
  };

  const filter = () => {
    const data = { studentClass, status };
    if (data) {
      axios
        .get("http://localhost:8001/api/students/filter", {
          params: {
            studentClass,
            status,
          },
        })
        .then((res) => {
          setStudentClass("");
          setStatus("");
          setFilteredData(res.data);
          close();
        })
        .catch((err) => {
          setStudentClass("");
          setStatus("");
          close();
        });
    }
  };

  const handleAddButtonClick = () => {
    router.push("/addStudent");
  };

  return (
    <Layout>
      <Header className={classes.header} mb={10}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>Students</Title>
          </Group>

          <Group>
            <TextInput
              icon={<IconSearch size="1.1rem" stroke={1.5} />}
              radius="md"
              size="sm"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search students"
            />
            <Group ml={5} spacing={5} className={classes.links}>
              <CSVLink
                filename={"students.csv"}
                data={
                  filteredData?.length > 0
                    ? filteredData
                    : searchResults?.length > 0
                    ? searchResults
                    : data?.length > 0
                    ? data
                    : []
                }
              >
                <Button style={{ backgroundColor: "#47d6ab", color: "white" }}>
                  Export
                </Button>
              </CSVLink>
              <Button
                onClick={open}
                style={{ backgroundColor: "#47d6ab", color: "white" }}
              >
                Filter
              </Button>
              <Button onClick={handleAddButtonClick}>
                <IconPlus />
              </Button>
            </Group>
          </Group>
        </div>
      </Header>

      <Modal
        overlayProps={{
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[9]
              : theme.colors.gray[2],
          opacity: 0.55,
          blur: 3,
        }}
        styles={(theme) => ({
          content: {
            height: "100%",
          },
        })}
        opened={opened}
        onClose={close}
        withCloseButton={false}
        size="fit-content"
      >
        <Flex
          mih={50}
          gap="md"
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
          mb="md"
        >
          <Select
            label="Filter by Class/Form"
            placeholder="filter by class"
            onChange={setStudentClass}
            data={[
              { value: 1, label: "Form 1" },
              { value: 2, label: "Form 2" },
              { value: 3, label: "Form 3" },
              { value: 4, label: "Form 4" },
            ]}
          />
          <Select
            label="Filter by status"
            placeholder="filter by status"
            onChange={setStatus}
            data={[
              { value: "Pending Enrollment", label: "Pending Enrollment" },
              { value: "Enrolled", label: "Enrolled" },
            ]}
          />
        </Flex>

        <Button
          mt="md"
          onClick={filter}
          style={{ backgroundColor: "#47d6ab", color: "white", width: "100%" }}
        >
          Apply filter
        </Button>
      </Modal>
      <CommonTable
        data={
          filteredData?.length > 0
            ? filteredData
            : searchResults.length > 0
            ? searchResults
            : data
        }
        columns={columns}
        title="Students"
      />
    </Layout>
  );
}

export default Students;
