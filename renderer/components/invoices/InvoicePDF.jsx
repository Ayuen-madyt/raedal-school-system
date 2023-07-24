import React, { useEffect, useRef, useState } from "react";
import {
  createStyles,
  Group,
  Button,
  Title,
  Text,
  Paper,
  Box,
  Flex,
  Center,
  Container,
  Image,
  Divider,
} from "@mantine/core";
import useSWR from "swr";
import fetcher from "../../../functionsToCallAPI/fetcher";
import { formatNumber } from "../common/formatNumber";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const useStyles = createStyles((theme) => ({
  schoolTitle: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 500,
    fontSize: theme.fontSizes.lg,
  },
  title: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontWeight: 500,
    fontSize: theme.fontSizes.sm,
  },
  text: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
  },
}));

export default function InvoicePDF({ invoice }) {
  const { classes } = useStyles();
  const pdfRef = useRef();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const { data, error, isLoading } = useSWR(
    "http://localhost:8001/api/settings/get",
    fetcher
  );

  const downloadPDF = async () => {
    if (!isImageLoaded) {
      return;
    }

    const input = pdfRef.current;

    const canvas = await html2canvas(input);

    const imageData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4", true);

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);

    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    const imgY = 30;

    pdf.addImage(
      imageData,
      "PNG",
      imgX,
      imgY,
      imgWidth * ratio,
      imgHeight * ratio
    );

    pdf.save(
      `${invoice?.party?.firstName}-${invoice?.party?.secondName}-${invoice?.party?.lastName}.pdf`
    );
  };

  const fetchImage = async () => {
    try {
      const response = await fetch(
        process.env.APPDATA +
          "/Raedal-school-system/uploads/" +
          data?.settings?.logo
      );

      if (response.ok) {
        const blob = await response.blob();
        setImageUrl(URL.createObjectURL(blob));
        setIsImageLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
      setIsImageLoaded(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);

  return (
    <Paper>
      <Flex
        gap="xs"
        justify="space-between"
        align="center"
        direction="row"
        wrap="wrap"
        mt="md"
      >
        <Text></Text>
        <Button onClick={downloadPDF} color="info" compact>
          Print
        </Button>
      </Flex>

      <Container ref={pdfRef}>
        <Center>
          <Box>
            {imageUrl && (
              <Image
                maw={60}
                mx="auto"
                radius="md"
                src={imageUrl}
                alt="logo"
                onLoad={() => setIsImageLoaded(true)}
              />
            )}
            <Flex
              gap="xs"
              justify="center"
              align="center"
              direction="column"
              wrap="wrap"
              mt="md"
            >
              <Text className={classes.schoolTitle}>
                {data?.settings?.name.toUpperCase()}
              </Text>
              <Text className={classes.title}>
                {`ADDRESS: ${data?.settings?.address.toUpperCase()}`}
              </Text>
              <Text className={classes.title}>
                {`EMAIL: ${data?.settings?.email.toUpperCase()}`}
              </Text>
              <Text className={classes.title}>
                {`CONTACT: ${data?.settings?.contact}`}
              </Text>
            </Flex>
          </Box>
        </Center>
        <Divider mt="md" size="sm" variant="dotted" />
        <Flex
          gap="xs"
          justify="space-between"
          align="center"
          direction="row"
          wrap="wrap"
          mt="md"
        >
          <Flex direction="column">
            <Flex direction="row" gap="xs">
              <Text className={classes.text}>NAME:</Text>
              <Text
                className={classes.text}
              >{`${invoice?.party?.firstName.toUpperCase()} ${invoice?.party?.secondName.toUpperCase()} ${invoice?.party?.lastName.toUpperCase()}`}</Text>
            </Flex>
            <Flex direction="row" gap="xs">
              <Text className={classes.text}>ADM NO:</Text>
              <Text className={classes.text}>{invoice?.party?._id}</Text>
            </Flex>
            <Flex direction="row" gap="xs">
              <Text className={classes.text}>CLASS/FORM:</Text>
              <Text className={classes.text}>
                {invoice?.party?.studentClass}
              </Text>
            </Flex>
          </Flex>

          <Flex direction="column">
            <Flex direction="row" gap="xs">
              <Text className={classes.text}>INVOICE NO:</Text>
              <Text className={classes.text}>{invoice?._id}</Text>
            </Flex>
            <Flex direction="row" gap="xs">
              <Text className={classes.text}>DATE:</Text>
              <Text className={classes.text}>
                {new Date(invoice?.date).toLocaleDateString()}
              </Text>
            </Flex>
            <Flex direction="row" gap="xs">
              <Text className={classes.text}>TERM:</Text>
              <Text className={classes.text}>
                {invoice?.term.term.toUpperCase()}
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Paper withBorder mt="md">
          <Flex
            gap="xs"
            justify="space-between"
            align="center"
            direction="row"
            wrap="wrap"
            mt="md"
            px={50}
          >
            <Text className={classes.text}>FEE COMPONENTS</Text>
            <Text className={classes.text}>AMOUNT</Text>
          </Flex>
          <Divider mt="sm" />
          {invoice?.term?.fields.map((field) => (
            <Flex
              key={field.label}
              mt="xs"
              gap="md"
              justify="space-between"
              align="center"
              direction="row"
              wrap="wrap"
              style={{ paddingRight: 50, paddingLeft: 50 }}
            >
              <Text className={classes.text}>{field?.label.toUpperCase()}</Text>
              <Text className={classes.text}>
                {formatNumber(field?.amount)}
              </Text>
            </Flex>
          ))}
          <Flex
            mt="xs"
            gap="md"
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
            mb="md"
            style={{ paddingRight: 50, paddingLeft: 50 }}
          >
            <Text>Total</Text>
            <Text>{`${localStorage.getItem("currency")} ${formatNumber(
              invoice?.term?.total
            )}`}</Text>
          </Flex>
          <Divider mt="sm" />
          <Flex
            mt="md"
            gap="md"
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
            style={{ paddingRight: 50, paddingLeft: 50 }}
          >
            <Text className={classes.text}>FEES AMOUNT RECEIVED</Text>
            <Text className={classes.text}>{`${localStorage.getItem(
              "currency"
            )} ${formatNumber(invoice.actualAmountPaid)}`}</Text>
          </Flex>
          <Flex
            mt="xs"
            gap="md"
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
            style={{ paddingRight: 50, paddingLeft: 50 }}
          >
            <Title order={6} className={classes.title}>
              TOTAL FEES AMOUNT PAID
            </Title>
            <Title order={6} className={classes.title}>{`${localStorage.getItem(
              "currency"
            )} ${formatNumber(invoice.amount)}`}</Title>
          </Flex>
          <Flex
            mt="xs"
            gap="md"
            justify="flex-end"
            align="center"
            direction="row"
            wrap="wrap"
            style={{ paddingRight: 50, paddingLeft: 50 }}
            mb="md"
          >
            <Text className={classes.text}>BALANCE</Text>
            {invoice?.outstandingAmount > 0 ? (
              <Text className={classes.text}>{`${localStorage.getItem(
                "currency"
              )} ${formatNumber(invoice.outstandingAmount)}`}</Text>
            ) : (
              <Text className={classes.text}>{`${localStorage.getItem(
                "currency"
              )} ${formatNumber(0)}`}</Text>
            )}
          </Flex>
        </Paper>

        <Flex direction="row" gap="xs" mt="lg">
          <Text>Remarks:</Text>
          <Text className={classes.text}>
            Fees once paid will not be refundable or transfarable
          </Text>
        </Flex>

        <Divider variant="dotted" mt={30} size="sm" />
      </Container>
    </Paper>
  );
}
