import Layout from "../Layout";
import { useState, useEffect, Fragment,useRef } from "react";
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
import { IconX, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import { useForm, isNotEmpty, isEmail } from "@mantine/form";
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

export default function NewStudent({ title, mode }) {
  const { classes } = useStyles();
  const [isHovered, setIsHovered] = useState(false);
  const scrollAreaRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [image, setImage] = useState({ preview: "", raw: "" });

  const form = useForm({
    initialValues: {
      id: "",
      firstName: "",
      secondName: "",
      lastName:"",
      studentClass: "",
      state: "",
      status: "",
      town: "",
      studentPhone: "",
      studentEmail: "",
      parentPhone: "",
      parentEmail: "",
    },
    validate: {
      firstName: isNotEmpty(),
      secondName: isNotEmpty(),
      lastName: isNotEmpty(),
      studentClass: (value) =>
        isNaN(Number(value)) || isNotEmpty()(value)
          ? "Enter a valid number"
          : null,
      status: isNotEmpty(),
      studentPhone: (value) => {
        if (isNaN(Number(value))) {
          return "Not a valid number";
        }
        if (isNotEmpty()(value)) {
          return "Field cannot be empty";
        }
        if (value.replace(/\D/g, "").length !== 10) {
          return "Phone number must have exactly 10 digits";
        }
        return null;
      },
      town: isNotEmpty(),
      state: isNotEmpty(),
      parentPhone: (value) => {
        if (isNaN(Number(value))) {
          return "Not a valid number";
        }
        if (isNotEmpty()(value)) {
          return "Field cannot be empty";
        }
        if (value.replace(/\D/g, "").length !== 10) {
          return "Phone number must have exactly 10 digits";
        }
        return null;
      },
      studentEmail: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
      parentEmail: (value) =>
        /^\S+@\S+$/.test(value) ? null : "Invalid email",
    },
    transformValues: (values) => ({
      id: "",
      firstName: values.firstName,
      secondName: values.secondName,
      lastName: values.lastName,
      studentClass: Number(values.studentClass),
      state: values.state,
      status: values.status,
      town: values.town,
      studentPhone: values.studentPhone,
      studentEmail: values.studentEmail,
      parentPhone: values.parentPhone,
      parentEmail: values.parentEmail,
    }),
  });

  const router = useRouter();

  const postData = async () => {
    form.validate();
    if (form.isValid()) {
      setLoading(true);
      const studentData = form.getTransformedValues();
      const formData = new FormData();
      formData.append("imagename", image.raw);
      Object.entries(studentData).forEach(([key, value]) => {
        formData.append(key, value);
      });

      try {
        const response = await axios.post(
          `http://localhost:8001/api/students/post`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response) {
          setTimeout(() => {
            setLoading(false);
            router.push("/students");
          }, 2000);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Form has errors");
    }
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
    setImage({ preview: null, file: null });
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
      <Center >
        <Paper
          radius="md"
          withBorder
          className={classes.studentContainer}
          p="md"
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
              overflow: "hidden",
              maxHeight: "calc(100vh - 20px)"
          })}
        >
          <Flex
            gap="md"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
            style={{
              marginBottom: "10px",
            }}
          >
            <Title style={{ fontSize: "15px" }}>{mode}</Title>
            <Box></Box>
          </Flex>
          <Divider />
          <ScrollArea
            ref={scrollAreaRef} 
            style={{width: "100%", overflow: "auto"}}
          >
            <Flex
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{
                borderBottom: "1.33px solid whitesmoke",
                paddingBottom: "10px",
                marginTop: "10px",
              }}
            >
              <Box
                position="relative"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <label htmlFor="upload-button">
                  {image.preview ? (
                    <Image
                      width={230}
                      height={150}
                      src={image.preview}
                      alt="Uploaded Image"
                      style={{ padding: "15px" }}
                      withPlaceholder
                    />
                  ) : (
                    <Image
                      width={230}
                      height={150}
                      src={null}
                      alt="Uploaded Image"
                      style={{ cursor: "pointer" }}
                      withPlaceholder
                    />
                  )}
                  {isHovered && image.preview && (
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
                  {...form.getInputProps("firstName")}
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
                  {...form.getInputProps("secondName")}
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
                  {...form.getInputProps("lastName")}
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
            <Box
              style={{
                borderBottom: "1.33px solid whitesmoke",
                paddingBottom: "10px",
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
                    {...form.getInputProps("studentClass")}
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
                    {...form.getInputProps("status")}
                    label="Status"
                    placeholder="Pick one"
                    onBlur={handleBlur}
                    mt="md"
                    data={[
                      { value: "Enrolled", label: "Enrolled" },
                      { value: "Pending Enrollment", label: "Pending Enrollment" },
                    ]}
                    styles={{
                      input: classes.input,
                      label: classes.label,
                    }}
                  />
                </Box>
                <Box>
                  <TextInput
                    {...form.getInputProps("state")}
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
                    {...form.getInputProps("town")}
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
            <Box
              style={{
                marginTop: "10px",
                paddingBottom: "10px"
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
                    {...form.getInputProps("studentPhone")}
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
                    {...form.getInputProps("parentPhone")}
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
                    {...form.getInputProps("studentEmail")}
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
                    {...form.getInputProps("parentEmail")}
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
          <Divider style={{marginTop:-20}} />
        </Paper>
      </Center>
    </Fragment>
  );
}
