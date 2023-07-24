import {
  createStyles,
  Navbar,
  TextInput,
  Code,
  UnstyledButton,
  Badge,
  Text,
  Group,
  ActionIcon,
  Tooltip,
  rem,
  Box,
} from "@mantine/core";
import { IconLogout, IconPlus, IconSelector } from "@tabler/icons-react";
import { UserButton } from "./UserButton/UserButton";
import Link from "next/link";
import { Fragment } from "react";
import fetcher from "../../functionsToCallAPI/fetcher";
import useSWR from "swr";
import axios from "axios";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  navbar: {
    paddingTop: 0,
    overflowY: "scroll",
    scrollbarWidth: "thin",
    display: "flex",
    justifyContent: "space-between",
    scrollbarColor: "transparent transparent",
    "&::-webkit-scrollbar": {
      display: "none", // Hides the scrollbar
    },
    // Add any other styling for the navbar
    backgroundColor: theme.colorScheme.background,
    position: "fixed",
    flex: 0.3,
  },

  section: {
    marginLeft: `calc(${theme.spacing.md} * -1)`,
    marginRight: `calc(${theme.spacing.md} * -1)`,
    marginBottom: theme.spacing.md,

    "&:not(:last-of-type)": {
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  },

  mainLinks: {
    paddingLeft: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingRight: `calc(${theme.spacing.md} - ${theme.spacing.xs})`,
    paddingBottom: theme.spacing.md,
  },

  mainLink: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },

  mainLinkInner: {
    display: "flex",
    alignItems: "center",
    flex: 1,
  },

  mainLinkIcon: {
    marginRight: theme.spacing.sm,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
  },

  mainLinkBadge: {
    padding: 0,
    width: rem(20),
    height: rem(20),
    pointerEvents: "none",
  },

  collections: {
    paddingLeft: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingRight: `calc(${theme.spacing.md} - ${rem(6)})`,
    paddingBottom: theme.spacing.md,
  },

  collectionsHeader: {
    paddingLeft: `calc(${theme.spacing.md} + ${rem(2)})`,
    paddingRight: theme.spacing.md,
    marginBottom: rem(5),
  },

  collectionLink: {
    display: "block",
    padding: `${rem(8)} ${theme.spacing.xs}`,
    textDecoration: "none",
    borderRadius: theme.radius.sm,
    fontSize: theme.fontSizes.xs,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    lineHeight: 1,
    cursor: "pointer",
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === "dark" ? theme.white : theme.black,
    },
  },
}));

const links = [
  { icon: "📶", label: "Dashboard", link: "/home" },
  { icon: "📋", label: "Invoices", link: "/invoices" },
  { icon: "💹", label: "Payments", link: "/payments" },
  { icon: "📚", label: "Balances", link: "/balances" },
  { icon: "📋", label: "General Ledger", link: "/ledger" },
];

const collections = [
  { emoji: "👨🏾‍🏫", label: "Students", link: "/students" },
  { emoji: "🧑🏾‍💼", label: "Teachers", link: "/teachers" },
  { emoji: "🧑🏿‍🏭", label: "Staff", link: "/staff" },
  { emoji: "💰", label: "Fee Structure", link: "/fees" },
  { emoji: "⚙️", label: "Settings", link: "/settings" },
];

export function Sidebar() {
  const { classes } = useStyles();
  const router = useRouter();
  const { data, error } = useSWR(
    "http://localhost:8001/api/settings/get",
    fetcher
  );

  const logout = () => {
    axios
      .get("http://localhost:8001/api/users/logout/1")
      .then((res) => {
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const mainLinks = links.map((link) => (
    <UnstyledButton key={link.label} className={classes.mainLink}>
      <div className={classes.mainLinkInner}>
        <Link href={link.link} className={classes.mainLinkInner}>
          <div>
            <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
              {link.icon}
            </span>
            <span>{link.label}</span>
          </div>
        </Link>
      </div>
    </UnstyledButton>
  ));

  const collectionLinks = collections.map((collection) => (
    <Link
      href={collection.link}
      key={collection.label}
      className={classes.collectionLink}
    >
      <div className={classes.collectionLink}>
        <span style={{ marginRight: rem(9), fontSize: rem(16) }}>
          {collection.emoji}
        </span>{" "}
        {collection.label}
      </div>
    </Link>
  ));

  return (
    <Navbar width={{ sm: 200 }} p="md" className={classes.navbar}>
      <Box>
        <Navbar.Section className={classes.section}>
          <UserButton
            image={
              process.env.APPDATA +
              "/Raedal-school-system/uploads/" +
              data?.settings?.logo
            }
            name={data?.settings?.name}
            email={data?.settings?.email}
            icon={<IconSelector size="0.9rem" stroke={1.5} />}
          />
        </Navbar.Section>

        <Navbar.Section className={classes.section}>
          <div className={classes.mainLinks}>{mainLinks}</div>
        </Navbar.Section>

        <Navbar.Section className={classes.section}>
          <Group className={classes.collectionsHeader} position="apart">
            <Text size="xs" weight={500} color="dimmed">
              Collections
            </Text>
            <Tooltip label="Create collection" withArrow position="right">
              <ActionIcon variant="default" size={18}>
                <IconPlus size="0.8rem" stroke={1.5} />
              </ActionIcon>
            </Tooltip>
          </Group>
          <div className={classes.collections}>{collectionLinks}</div>
        </Navbar.Section>
      </Box>

      <Group onClick={logout} style={{ cursor: "pointer" }}>
        <div
          style={{
            display: "flex",
            marginBottom: 10,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text size="sm" weight={500} style={{ marginRight: 8 }}>
            Log Out
          </Text>

          <IconLogout size="0.9rem" stroke={1.5} />
        </div>
      </Group>
    </Navbar>
  );
}
