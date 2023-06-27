import React, { Fragment, useState, useEffect, useRef } from "react";
import {
  createStyles,
  Table,
  ScrollArea,
  rem,
  Badge,
  Pagination,
  Group,
  Divider,
} from "@mantine/core";
import { IconSearch, IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/router";

const useStyles = createStyles((theme) => ({
  tableHeader: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  row: {
    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[1]
          : theme.colors.gray[1],
    },
  },
  words: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 450,
  },

  // header search
  header: {
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    marginTop: 5,
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

export default function CommonTable({ data, columns, title }) {
  const { classes } = useStyles();
  const scrollAreaRef = useRef(null);
  const router = useRouter();

  const itemsPerPage = 50; // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate start and end indexes based on the current page and items per page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage + 1;

  // Get the current page's data
  const currentData = data?.slice(startIndex, endIndex);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data?.length / itemsPerPage);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
    <Fragment>
      <div>
        <ScrollArea
          style={{ height: "calc(100vh - 100px)", overflowY: "auto" }}
        >
          <Table miw={700} striped={false}>
            <thead className={classes.tableHeader}>
              <tr>
                {/* Add a new column for the index number */}
                <th>#</th>
                {columns.map((column) => (
                  <th key={column.dataKey}>{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentData?.map((row, index) => (
                <Link
                  key={row._id}
                  href={
                    title == "Students"
                      ? `/studentDetails/${row._id}`
                      : title == "Teachers"
                      ? `/teacherDetails/${row._id}`
                      : title == "Staff"
                      ? `/staffDetails/${row._id}`
                      : title == "Invoices"
                      ? `/invoiceDetails/${row._id}`
                      :router.asPath
                  }
                  passHref
                >
                  <tr
                    key={row.id}
                    className={classes.row}
                    style={{ cursor: "pointer" }}
                  >
                    <td className={classes.words}>{startIndex + index + 1}</td>
                    {columns.map((column) => (
                      <td className={classes.words} key={column.dataKey}>
                        {column.dataKey === "fullName" && (
                          <span>
                            {row.firstName} {row.secondName}
                          </span>
                        )}
                        {row[column.dataKey] === "Paid" && (
                          <Badge color="teal" className={classes.badgePaid}>
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Unpaid" && (
                          <Badge color="orange" className={classes.badgeUnpaid}>
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Widthdrawn" && (
                          <Badge color="red" className={classes.badgeCancelled}>
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Enrolled" && (
                          <Badge
                            color="info"
                            className={classes.badgeCancelled}
                          >
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Pending Enrollment" && (
                          <Badge
                            color="orange"
                            className={classes.badgeCancelled}
                          >
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Employed" && (
                          <Badge
                            color="info"
                            className={classes.badgeCancelled}
                          >
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Not Working" && (
                          <Badge color="red" className={classes.badgeCancelled}>
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Pending" && (
                          <Badge
                            color="orange"
                            className={classes.badgeCancelled}
                          >
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] === "Cancelled" && (
                          <Badge color="red" className={classes.badgeCancelled}>
                            {row[column.dataKey]}
                          </Badge>
                        )}
                        {row[column.dataKey] !== "Paid" &&
                          row[column.dataKey] !== "Unpaid" &&
                          row[column.dataKey] !== "Widthdrawn" &&
                          row[column.dataKey] !== "Enrolled" &&
                          row[column.dataKey] !== "Pending Enrollment" &&
                          row[column.dataKey] !== "Employed" &&
                          row[column.dataKey] !== "Pending" &&
                          row[column.dataKey] !== "Not Working" &&
                          row[column.dataKey] !== "Cancelled" && (
                            <span>{row[column.dataKey]}</span>
                          )}
                      </td>
                    ))}
                  </tr>
                </Link>
              ))}
            </tbody>
          </Table>
        </ScrollArea>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          backgroundColor: "white",
          width: "100%",
        }}
      >
        <Divider mb="sm" />
        <Pagination.Root
          total={totalPages}
          value={currentPage}
          onChange={handlePageChange}
        >
          <Group
            spacing={5}
            position="center"
            mb="sm"
            style={{ marginRight: 230 }}
          >
            <Pagination.First />
            <Pagination.Previous />
            <Pagination.Items />
            <Pagination.Next />
            <Pagination.Last />
          </Group>
        </Pagination.Root>
      </div>
    </Fragment>
  );
}
