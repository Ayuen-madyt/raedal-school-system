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
} from "@mantine/core";
import { IconX, IconTrash, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
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

  search: {
    [theme.fn.smallerThan("xs")]: {
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

export default function StudentInfo({ title, mode, student }) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [waitingDelete, setWaitingDelete] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [firstName, setFirstName] = useState(student?.firstName);
  const [secondName, setSecondName] = useState(student?.secondName);
  const [lastName, setLastName] = useState(student?.lastName);
  const [studentClass, setStudentClass] = useState(student?.studentClass);
  const [state, setState] = useState(student?.state);
  const [status, setStatus] = useState(student?.status);
  const [town, setTown] = useState(student?.town);
  const [studentPhone, setStudentPhone] = useState(student?.studentPhone);
  const [studentEmail, setStudentEmail] = useState(student?.studentEmail);
  const [parentPhone, setParentPhone] = useState(student?.parentPhone);
  const [parentEmail, setParentEmail] = useState(student?.parentEmail);
  const [remove, setRemove] = useState(null);
  const scrollAreaRef = useRef(null);

  const studentData = {
    id: student?._id,
    firstName,
    secondName,
    lastName,
    studentClass,
    state,
    status,
    town,
    studentPhone,
    studentEmail,
    parentPhone,
    parentEmail,
    img: student?.image,
  };

  const router = useRouter();

  const postData = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("imagename", image.raw);

    Object.entries(studentData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios
      .post(`http://localhost:8001/api/students/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setTimeout(() => {
          setLoading(false);
          router.push("/students");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteStudent = () => {
    setWaitingDelete(true);
    axios
      .delete(`http://localhost:8001/api/students/delete/${student?._id}`)
      .then((res) => {
        setTimeout(() => {
          setWaitingDelete(false);
          router.push("/students");
        }, 2000);
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
  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setShowSave(true);
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const handleRemoveImage = () => {
    setRemove(1);
    if (remove) {
      studentData.remove = remove;
      postData();
    }
  };
  const handleBlur = () => {
    setShowSave(true);
  };

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
                <Button
                  color="info"
                  compact
                  onClick={postData}
                  disabled={loading}
                >
                  {loading ? <Loader size="xs" /> : "Save"}
                </Button>
              )}
              <Button color="red" compact onClick={deleteStudent}>
                {waitingDelete ? (
                  <Loader color="white" inline size="xs" />
                ) : (
                  <IconTrash />
                )}
              </Button>
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
            <Title
              style={{ fontSize: "15px" }}
            >{`${student?.firstName} ${student?.secondName}`}</Title>
            <Badge color={!showSave ? "info" : "gray"}>
              {!showSave ? "Saved" : "Draft"}
            </Badge>
          </Flex>
          <Divider />
          <ScrollArea
            ref={scrollAreaRef}
            style={{ width: "100%", overflow: "auto" }}
          >
            <Flex
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{
                marginBottom: "10px",
                marginTop: "10px",
              }}
            >
              <Box
                position="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <label htmlFor="upload-button">
                  {student?.image ? (
                    <Image
                      width={230}
                      height={150}
                      src={
                        process.env.APPDATA +
                        "/Raedal-school-system/uploads/" +
                        student?.image
                      }
                      alt="Uploaded Image"
                      style={{ cursor: "pointer" }}
                      withPlaceholder
                    />
                  ) : (
                    <Image
                      width={230}
                      height={150}
                      src={image.preview}
                      alt="Uploaded Image"
                      style={{ cursor: "pointer" }}
                      withPlaceholder
                    />
                  )}

                  {isHovered && student?.image && (
                    <Button
                      onClick={handleRemoveImage}
                      style={{
                        position: "absolute",
                        top: "4px",
                        right: "70%",
                        backgroundColor: "rgba(128, 128, 128, 0.8)",
                        border: "none",
                        borderRadius: "50%",
                        padding: "4px",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontSize: "10px",
                      }}
                    >
                      <IconX />
                    </Button>
                  )}
                </label>
                <input
                  type="file"
                  id="upload-button"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
              </Box>
              <Box>
                <TextInput
                  value={firstName}
                  onChange={(e) => setFirstName(e.currentTarget.value)}
                  onBlur={handleBlur}
                  w={250}
                  label="First Name"
                  placeholder="First Name"
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                />
                <TextInput
                  w={250}
                  mt="md"
                  value={secondName}
                  onChange={(e) => setSecondName(e.currentTarget.value)}
                  onBlur={handleBlur}
                  label="Second Name"
                  placeholder="Second Name"
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                />
                <TextInput
                  w={250}
                  mt="md"
                  value={lastName}
                  onChange={(e) => setLastName(e.currentTarget.value)}
                  onBlur={handleBlur}
                  label="Last Name"
                  placeholder="Last Name"
                  styles={{
                    input: classes.input,
                    label: classes.label,
                  }}
                />
              </Box>
            </Flex>
            <Title style={{ fontSize: "13.5px", color: "grey" }}>
              Information
            </Title>
            <Box
              style={{
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <Flex
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Box>
                  <TextInput
                    style={{ fontSize: "10px" }}
                    value={studentClass}
                    onChange={(e) => setStudentClass(e.currentTarget.value)}
                    onBlur={handleBlur}
                    w={250}
                    label="Class"
                    placeholder="Class"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                  <Select
                    value={status}
                    onChange={setStatus}
                    label="Status"
                    placeholder="Pick one"
                    onBlur={handleBlur}
                    mt="md"
                    data={[
                      { value: "Enrolled", label: "Enrolled" },
                      { value: "Widthdrawn", label: "Widthdrawn" },
                      {
                        value: "Pending Enrollment",
                        label: "Pending Enrollment",
                      },
                    ]}
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Box>
                <Box>
                  <TextInput
                    value={state}
                    onChange={(e) => setState(e.currentTarget.value)}
                    onBlur={handleBlur}
                    w={250}
                    label="State"
                    placeholder="State e.g Jonglei"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                  <TextInput
                    value={town}
                    onChange={(e) => setTown(e.currentTarget.value)}
                    onBlur={handleBlur}
                    w={250}
                    mt="md"
                    label="Town/City"
                    placeholder="Town or city e.g Kajo Keji"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Box>
              </Flex>
            </Box>
            <Title style={{ fontSize: "13.5px", color: "grey" }}>Contact</Title>
            <Box
              style={{
                marginBottom: "40px",
                marginTop: "10px",
              }}
            >
              <Flex
                gap="md"
                justify="space-between"
                align="center"
                direction="row"
                wrap="wrap"
              >
                <Box>
                  <TextInput
                    value={studentPhone}
                    onChange={(e) => setStudentPhone(e.currentTarget.value)}
                    onBlur={handleBlur}
                    w={250}
                    label="Student Phone No"
                    placeholder="Student Phone"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                  <TextInput
                    w={250}
                    mt="md"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.currentTarget.value)}
                    onBlur={handleBlur}
                    label="Parent or Guardian Phone No"
                    placeholder="Parent or Guardian Phone No"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Box>
                <Box>
                  <TextInput
                    w={250}
                    value={studentEmail}
                    onChange={(e) => setStudentEmail(e.currentTarget.value)}
                    onBlur={handleBlur}
                    label="Student Email"
                    placeholder="Student Email"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                  <TextInput
                    w={250}
                    mt="md"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.currentTarget.value)}
                    onBlur={handleBlur}
                    label="Parent or Guardian Email"
                    placeholder="Parent or Guardian Email"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Box>
              </Flex>
            </Box>
          </ScrollArea>
          <Divider style={{ marginTop: -20 }} />
        </Paper>
      </Center>
    </Fragment>
  );
}
