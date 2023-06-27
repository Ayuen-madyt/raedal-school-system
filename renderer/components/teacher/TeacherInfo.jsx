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

export default function TeacherInfo({ headerTitle, mode, teacher }) {
  const { classes } = useStyles();
  const [loading, setLoading] = useState(false);
  const [waitingDelete, setWaitingDelete] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [firstName, setFirstName] = useState(teacher?.firstName);
  const [secondName, setSecondName] = useState(teacher?.secondName);
  const [lastName, setLastName] = useState(teacher?.lastName);
  const [title, setTitle] = useState(teacher?.title);
  const [state, setState] = useState(teacher?.state);
  const [passport, setPassport] = useState(teacher?.passport);
  const [status, setStatus] = useState(teacher?.status);
  const [contact, setContact] = useState(teacher?.contact);
  const [email, setEmail] = useState(teacher?.email);
  const [remove, setRemove] = useState(null);
  const scrollAreaRef = useRef(null);

  const teacherData = {
    id: teacher?._id,
    firstName,
    secondName,
    lastName,
    title,
    state,
    status,
    contact,
    email,
    passport,
    img: teacher?.image,
  };

  const router = useRouter();

  const postData = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("imagename", image.raw);

    Object.entries(teacherData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios
      .post(`http://localhost:8001/api/teachers/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setTimeout(() => {
          setLoading(false);
          router.push("/teachers");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteTeacher = () => {
    setWaitingDelete(true);
    axios
      .delete(`http://localhost:8001/api/teachers/delete/${teacher?._id}`)
      .then((res) => {
        setTimeout(() => {
          setWaitingDelete(false);
          router.push("/teachers");
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
            <Title style={{ fontSize: "15px" }}>{headerTitle}</Title>
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
              <Button color="red" compact onClick={deleteTeacher}>
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
            >{`${teacher?.title} ${teacher?.firstName} ${teacher?.secondName}`}</Title>
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
                  {teacher?.image ? (
                    <Image
                      width={230}
                      height={150}
                      src={
                        process.env.APPDATA +
                        "/Raedal-school-system/uploads/" +
                        teacher?.image
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

                  {isHovered && teacher?.image && (
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
                  <Select
                    style={{ fontSize: "10px", marginTop: "5px" }}
                    value={title}
                    onChange={setTitle}
                    label="Title"
                    placeholder="Pick one"
                    onBlur={handleBlur}
                    w={250}
                    mt="md"
                    data={[
                      { value: "Mr", label: "Mr" },
                      { value: "Mrs", label: "Mrs" },
                      { value: "Ms", label: "Ms" },
                      { value: "Miss", label: "Miss" },
                    ]}
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
                      { value: "Employed", label: "Employed" },
                      { value: "Pending", label: "Pending" },
                      { value: "Not Working", label: "Not Working" },
                    ]}
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Box>
                <Box>
                  <TextInput
                    value={passport}
                    onChange={(e) => setPassport(e.currentTarget.value)}
                    onBlur={handleBlur}
                    w={250}
                    mt="md"
                    label="ID/Passport"
                    placeholder="ID or Passport"
                    style={{ marginTop: "8px" }}
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                  <TextInput
                    value={state}
                    onChange={(e) => setState(e.currentTarget.value)}
                    onBlur={handleBlur}
                    w={250}
                    label="State"
                    placeholder="State e.g Jonglei"
                    style={{ marginTop: "15px" }}
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
                    value={contact}
                    onChange={(e) => setContact(e.currentTarget.value)}
                    onBlur={handleBlur}
                    w={250}
                    label="Phone No"
                    placeholder="Phone number"
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Box>
                <Box>
                  <TextInput
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    w={250}
                    onBlur={handleBlur}
                    label="Email"
                    placeholder="Student Email"
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
