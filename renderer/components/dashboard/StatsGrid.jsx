import React, { useEffect, useContext, useState } from "react";
import {
  createStyles,
  Progress,
  Box,
  Text,
  Group,
  Paper,
  SimpleGrid,
  rem,
  Center,
  Title,
  Flex,
} from "@mantine/core";
import {
  IconArrowUpRight,
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowDownRight,
} from "@tabler/icons-react";
import { formatNumber } from "../common/formatNumber";
import fetcher from "../../../functionsToCallAPI/fetcher";
import useSWR from "swr";

const useStyles = createStyles((theme) => ({
  statsContainer: {
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
    },
  },
  root: {
    padding: `calc(${theme.spacing.xl} * 0.6)`,
  },
  tranStats: {
    width: 400,
    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
    [theme.fn.largerThan("lg")]: {
      width: "40%",
      margin: "0 auto",
    },
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
    color: "#47d6ab",
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
  progressLabel: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1,
    fontSize: theme.fontSizes.sm,
  },

  stat: {
    borderBottom: `${rem(3)} solid`,
    paddingBottom: rem(5),
  },

  statCount: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    lineHeight: 1.3,
  },

  diff: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },
}));

export function StatsGrid({ grandTotalAmount, totalAmountThisYear }) {
  const { classes } = useStyles();
  const [currency, setCurrency] = useState("");
  const { data, error } = useSWR(
    "http://localhost:8001/api/balances/all",
    fetcher
  );

  useEffect(() => {
    console.log(window.localStorage.getItem("currency"));
    setCurrency(localStorage.getItem("currency"));
  }, []);

  const balancesThisYear = data?.reduce(
    (sum, balance) => sum + balance.balance,
    0
  );

  const calculatePercentageTotal = (balance, feePaid) => {
    const total = balance + feePaid;
    const percentageBalance = Math.round((balance / total) * 100);
    const percentageTotal = Math.round((feePaid / total) * 100);

    return {
      totalBalance: percentageBalance,
      totalFee: percentageTotal,
    };
  };

  const balances = [
    {
      title: "Total Fee Paid Overtime",
      value: formatNumber(grandTotalAmount),
      desc: "Grand Total Fee Paid Overtime",
    },
    {
      title: "Total Fee Paid This Year",
      icon: "receipt",
      value: formatNumber(totalAmountThisYear),
      desc: "Total amount of fee paid this year",
    },
    {
      title: "Balances this year",
      value: formatNumber(balancesThisYear),
      desc: "Total fee balance unpaid this year",
    },
  ];

  const statData = [
    {
      label: "Total Fee Paid this year",
      count: formatNumber(totalAmountThisYear),
      part: calculatePercentageTotal(balancesThisYear, totalAmountThisYear)
        .totalFee,
      color: "#47d6ab",
    },
    {
      label: "Balances this year",
      count: formatNumber(balancesThisYear),
      part: calculatePercentageTotal(balancesThisYear, totalAmountThisYear)
        .totalBalance,
      color: "#03141a",
    },
  ];

  const segments = statData.map((segment) => ({
    value: segment.part,
    color: segment.color,
    label: segment.part > 10 ? `${segment.part}%` : undefined,
  }));

  const descriptions = statData.map((stat) => (
    <Box
      key={stat.label}
      sx={{ borderBottomColor: stat.color }}
      className={classes.stat}
    >
      <Text tt="uppercase" fz="xs" c="dimmed" fw={700}>
        {stat.label}
      </Text>

      <Group position="apart" align="flex-end" spacing={0}>
        <Text fw={700}>{`${currency} ${stat.count}`}</Text>
        <Text c={stat.color} fw={700} size="sm" className={classes.statCount}>
          {stat.part}%
        </Text>
      </Group>
    </Box>
  ));

  const stats = balances.map((stat) => {
    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{`${currency} ${stat.value}`}</Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          {stat.desc}
        </Text>
      </Paper>
    );
  });

  return (
    <Flex gap={20} className={classes.statsContainer}>
      <Paper withBorder p="md" radius="md" className={classes.tranStats}>
        <Text c="dimmed" fz="sm">
          Percentage segments of the fee paid and balances
        </Text>
        <Progress
          sections={segments}
          size={34}
          classNames={{ label: classes.progressLabel }}
          mt="md"
        />
        <SimpleGrid
          cols={2}
          breakpoints={[{ maxWidth: "xs", cols: 1 }]}
          mt="xl"
        >
          {descriptions}
        </SimpleGrid>
      </Paper>
      <Paper withBorder className={classes.root} radius="md">
        <SimpleGrid
          cols={3}
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {stats}
        </SimpleGrid>
      </Paper>
    </Flex>
  );
}
