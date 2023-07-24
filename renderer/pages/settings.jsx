import Layout from "../components/Layout";
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
  ScrollArea,
  Select,
  Group,
  Header,
  rem,
  Loader,
  Divider,
  Image,
  TextInput,
  Box,
} from "@mantine/core";
import { IconSelector, IconArrowLeft } from "@tabler/icons-react";
import { useRouter } from "next/router";
import useSWR from "swr";
import fetcher from "../../functionsToCallAPI/fetcher";
import { formatNumber } from "../components/common/formatNumber";
import { UserButton } from "../components/UserButton/UserButton";
import axios from "axios";
import defaultLogo from "../../resources/defualt-logo.png";

const useStyles = createStyles((theme) => ({
  studentContainer: {
    width: "60%",
    boxShadow: `0px 6px 16px rgba(0, 0, 0, 0.1)`,
    marginTop: 20,
  },
  // header search
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginTop: 5,
  },

  title: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 600,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
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
  text: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 400,
  },
  title: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 450,
    fontSize: 17,
  },
  term: {
    cursor: "pointer",
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[1],
    },
    padding: 10,
  },
}));

export default function Settings({ title, mode }) {
  const { classes } = useStyles();
  const scrollAreaRef = useRef(null);
  const router = useRouter();

  const { data, error } = useSWR(
    "http://localhost:8001/api/settings/get",
    fetcher
  );

  const [name, setName] = useState(data?.settings?.name);
  const [email, setEmail] = useState(data?.settings?.email);
  const [address, setAddress] = useState(data?.settings?.address);
  const [contact, setContact] = useState(data?.settings?.contact);
  const [image, setImage] = useState({ preview: "", raw: "" });
  const [currency, setCurrency] = useState(data?.settings?.currency);
  const [showSave, setShowSave] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    setShowSave(true);
    if (e.target.files.length) {
      setImage({
        preview: URL.createObjectURL(e.target.files[0]),
        raw: e.target.files[0],
      });
    }
  };

  const settingsData = {
    id: data?._id,
    name,
    email,
    address,
    contact,
    currency,
    logo: data?.settings?.logo,
  };

  const postData = () => {
    setLoading(true);
    const formData = new FormData();
    if (image) {
      formData.append("imagename", image?.raw);
    }
    Object.entries(settingsData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios
      .post(`http://localhost:8001/api/settings/post`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setTimeout(() => {
          setLoading(false);
          console.log("res", res);
          router.push("/home");
        }, 2000);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleBlur = () => {
    setShowSave(true);
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

  return (
    <Layout>
      {/* header options */}
      <Header className={classes.header}>
        <div className={classes.inner}>
          <Group>
            <Title style={{ fontSize: "15px" }}>Settings</Title>
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
                style={{ backgroundColor: "#47d6ab", color: "white" }}
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
            <Title style={{ fontSize: "15px" }}>Settings</Title>
            <Badge></Badge>
          </Flex>
          <Divider />
          <ScrollArea
            mt="md"
            ref={scrollAreaRef}
            style={{ width: "100%", overflow: "auto" }}
          >
            <Flex justify="space-between" align="center">
              <UserButton
                image={
                  image?.preview
                    ? image.preview
                    : data?.settings?.logo
                    ? process.env.APPDATA +
                      "/Raedal-school-system/uploads/" +
                      data?.settings?.logo
                    : ""
                }
                name={data?.settings?.name}
                email={data?.settings?.email}
                icon={<IconSelector size="0.9rem" stroke={1.5} />}
              />
              <Box ml={30}>
                <label for="logo">upload logo</label>

                <input
                  type="file"
                  id="logo"
                  name="logo"
                  onChange={handleImageChange}
                  placeholder="upload logo ⏏"
                  accept="image/png, image/jpeg"
                />
              </Box>
            </Flex>
            <Divider />
            <Flex
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{
                paddingBottom: "10px",
              }}
              mt="md"
            >
              <Title className={classes.title}>Name:</Title>
              <TextInput
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                placeholder="School Name"
                w={300}
                onBlur={handleBlur}
              />
            </Flex>
            <Flex
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{
                paddingBottom: "10px",
              }}
              mt="md"
            >
              <Title className={classes.title}>Email:</Title>
              <TextInput
                placeholder="School email"
                w={300}
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
                onBlur={handleBlur}
              />
            </Flex>
            <Flex
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{
                paddingBottom: "10px",
              }}
              mt="md"
            >
              <Title className={classes.title}>Address:</Title>
              <TextInput
                placeholder="address"
                w={300}
                value={address}
                onChange={(e) => setAddress(e.currentTarget.value)}
                onBlur={handleBlur}
              />
            </Flex>
            <Flex
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{
                paddingBottom: "10px",
              }}
              mt="md"
            >
              <Title className={classes.title}>Contact:</Title>
              <TextInput
                placeholder="address"
                w={300}
                value={contact}
                onChange={(e) => setContact(e.currentTarget.value)}
                onBlur={handleBlur}
              />
            </Flex>
            <Flex
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{
                paddingBottom: "10px",
              }}
              mt="md"
            >
              <Title className={classes.title}>Currency:</Title>
              <Select
                w={300}
                onBlur={handleBlur}
                value={currency}
                onChange={setCurrency}
                placeholder="Choose currency"
                data={[
                  { value: "SSP", label: "South Sudan (SSP)" },
                  { value: "KES", label: "Kenya (KES)" },
                  { value: "USD", label: "US Dollars (USD)" },
                ]}
              />
            </Flex>
          </ScrollArea>
          <Divider style={{ marginTop: -20 }} />
        </Paper>
      </Center>
    </Layout>
  );
}
