import Layout from "../Layout";
import { useState, useEffect, Fragment, useRef } from "react";
import {
  createStyles,
  Text,
  Button,
  Paper,
  Flex,
  Center,
  Title,
  Badge,
  Image,
  Box,
  TextInput,
  ScrollArea,
  Select,
  Group,
  Header,
  rem,
  Loader,
  Divider,
  Alert,
} from "@mantine/core";
import { IconAlertCircle, IconTrash, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { MonthPickerInput } from "@mantine/dates";
import useSWR from "swr";
import fetcher from "../../../functionsToCallAPI/fetcher";
import axios from "axios";

const useStyles = createStyles((theme) => ({
  studentContainer: {
    width: "55%",
    boxShadow: `0px 6px 16px rgba(0, 0, 0, 0.1)`,
    marginTop: 20,
  },
  // header search
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginTop: 5,
  },

  inner: {
    height: rem(45),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
  input: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 400,
  },
  label: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 400,
  },
}));

export default function NewFee({ title, mode }) {
  const { classes } = useStyles();
  const [fields, setFields] = useState([{ label: "", amount: "" }]);
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [term, setTerm] = useState("");
  const [termStartDate, setTermStartDate] = useState('');
  const [termEndDate, setTermEndDate] = useState('');
  const scrollAreaRef = useRef(null);
  const router = useRouter();

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);

    fields.forEach((field, index) => {
      const label = field.label;
      const amount = field.amount;

      // Perform further processing or submit the field values
      console.log(`Field ${index + 1}: Label = ${label}, Amount = ${amount}`);
    });
  };

  const handleAddField = () => {
    setFields([...fields, { label: "", amount: "" }]);
  };

  const handleRemoveField = (index) => {
    const updatedFields = [...fields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  };

  const totalAmount = fields?.reduce((sum, field) => {
    const amount = parseFloat(field?.amount);
    return isNaN(amount) ? sum : sum + amount;
  }, 0);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Perform form submission or further processing here
    console.log(fields); // Process each field individually
  };

  const handleBlur = () => {
    setShowSave(true);
  };

  const data = {
    id: "",
    fields,
    totalAmount,
    term,
    termStartDate,
    termEndDate
  };

  const postData = async () => {
    setLoading(true);
    axios
      .post(`http://localhost:8001/api/fee/post`, data)
      .then((res) => {
        setTimeout(() => {
          setLoading(false);
          router.push("/fees");
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const resizeScrollArea = () => {
      const scrollArea = scrollAreaRef.current;
      if (scrollArea) {
        const windowHeight = window.innerHeight;
        const scrollAreaTop = scrollArea.getBoundingClientRect().top;
        const scrollAreaHeight = windowHeight - scrollAreaTop;
        scrollArea.style.height = `${scrollAreaHeight}px`;
      }
    };

    window.addEventListener("resize", resizeScrollArea);
    resizeScrollArea();

    return () => {
      window.removeEventListener("resize", resizeScrollArea);
    };
  }, []);

  console.log(data)

  return (
    <Fragment>
      {/* header options */}
      <Header className={classes.header}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>{title}</Title>
          </Group>

          <Group>
            <Group ml={5} spacing={5} className={classes.links}>
              {showSave && (
                <Button onClick={postData} color="info" compact disabled={loading}>
                  {loading ? <Loader size="xs" color="white" /> : "Save"}
                </Button>
              )}
              <Button
                compact
                style={{ backgroundColor: "#e8e9fa", color: "grey" }}
                onClick={() => router.back()}
              >
                <IconArrowLeft />
              </Button>
            </Group>
          </Group>
        </div>
      </Header>
      {/* end header options */}
      <Center>
        <Paper
          radius="md"
          withBorder
          className={classes.studentContainer}
          p="md"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
            overflow: "hidden",
            maxHeight: "calc(100vh - 20px)",
          })}
        >
          <Flex
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
            style={{
              paddingBottom: "10px",
            }}
          >
            <Title style={{ fontSize: "15px" }}>Add Fee</Title>
            <Badge></Badge>
          </Flex>
          <Divider />
          <ScrollArea
            mt="md"
            ref={scrollAreaRef}
            style={{ width: "100%", overflow: "auto" }}
          >
            <Select
              label="Term"
              placeholder="Choose term"
              data={[
                { value: "term 1", label: "Term 1" },
                { value: "term 2", label: "Term 2" },
                { value: "term 3", label: "Term 3" },
              ]}
              required
              onChange={setTerm}
              onBlur={handleBlur}
              styles={{
                input: classes.input,
                label: classes.label,
              }}
            />
            <Flex
              mt="md"
              mb="md"
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
            >
              <Select
                label="Term start date"
                placeholder="Term start date"
                required
                onChange={setTermStartDate}
                onBlur={handleBlur}
                data={[
                  { value: 0, label: "January" },
                  { value: 1, label: "February" },
                  { value: 2, label: "March" },
                  { value: 3, label: "April" },
                  { value: 4, label: "May" },
                  { value: 5, label: "June" },
                  { value: 6, label: "July" },
                  { value: 7, label: "August" },
                  { value: 8, label: "September" },
                  { value: 9, label: "October" },
                  { value: 10, label: "November" },
                  { value: 11, label: "December" },
                ]}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
                w={250}
              />
              <Select
                label="Term end date"
                placeholder="Term end date"
                required
                onChange={setTermEndDate}
                onBlur={handleBlur}
                data={[
                  { value: 0, label: "January" },
                  { value: 1, label: "February" },
                  { value: 2, label: "March" },
                  { value: 3, label: "April" },
                  { value: 4, label: "May" },
                  { value: 5, label: "June" },
                  { value: 6, label: "July" },
                  { value: 7, label: "August" },
                  { value: 8, label: "September" },
                  { value: 9, label: "October" },
                  { value: 10, label: "November" },
                  { value: 11, label: "December" },
                ]}
                styles={{
                  input: classes.input,
                  label: classes.label,
                }}
                w={250}
              />
            </Flex>
            <form onSubmit={handleSubmit}>
              {fields.map((field, index) => (
                <Paper
                  key={index}
                  style={{ marginBottom: "5px", padding: "5px" }}
                >
                  <Flex
                    gap="md"
                    justify="space-between"
                    align="center"
                    direction="row"
                    wrap="wrap"
                    style={{
                      paddingBottom: "10px",
                    }}
                  >
                    <TextInput
                      w={250}
                      label="Label"
                      value={field.label}
                      onChange={(event) =>
                        handleFieldChange(index, "label", event.target.value)
                      }
                      onBlur={handleBlur}
                      required
                      styles={{
                        input: classes.input,
                        label: classes.label,
                      }}
                    />
                    <TextInput
                      w={250}
                      label="Amount"
                      type="number"
                      value={field.amount}
                      onChange={(event) =>
                        handleFieldChange(index, "amount", event.target.value)
                      }
                      required
                      onBlur={handleBlur}
                      styles={{
                        input: classes.input,
                        label: classes.label,
                      }}
                    />
                  </Flex>
                </Paper>
              ))}
              <Flex
                gap="md"
                justify="flex-end"
                align="center"
                direction="row"
                wrap="wrap"
                mb="md"
              >
                <TextInput
                  w={250}
                  label="Grand Total"
                  type="number"
                  variant="filled"
                  value={totalAmount}
                  required
                />
              </Flex>
              <Divider mb="md" />
              <Center>
                <Button onClick={handleAddField} variant="outline">
                  Add Field
                </Button>
                {fields.length > 1 && (
                  <Button
                    onClick={() => handleRemoveField(fields.length - 1)}
                    color="red"
                    variant="outline"
                    ml="md"
                  >
                    Remove Field
                  </Button>
                )}
              </Center>
            </form>
          </ScrollArea>
          <Divider style={{ marginTop: -20 }} />
        </Paper>
      </Center>
    </Fragment>
  );
}
