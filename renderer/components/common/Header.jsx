import {
  createStyles,
  Header,
  Autocomplete,
  Group,
  rem,
  Button,
  Title,
  TextInput,
  TextInputProps,
  ActionIcon,
  useMantineTheme,
} from "@mantine/core";
import { IconSearch, IconArrowRight, IconArrowLeft } from "@tabler/icons-react";

const useStyles = createStyles((theme) => ({
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginTop: 5,
    position:"sticky"
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

export default function HeaderSearch({ title }) {
  const theme = useMantineTheme();
  const { classes } = useStyles();

  return (
    <Header className={classes.header} mb={10}>
      <div className={classes.inner}>
        <Group>
          <Title style={{ fontSize: "15px" }}>{title}</Title>
        </Group>

        <Group>
          <TextInput
            icon={<IconSearch size="1.1rem" stroke={1.5} />}
            radius="md"
            size="sm"
            placeholder="Search questions"
            rightSectionWidth={30}
          />
          <Group ml={5} spacing={5} className={classes.links}>
            <Button variant="default">Export</Button>
            <Button>Filter</Button>
          </Group>
        </Group>
      </div>
    </Header>
  );
}
