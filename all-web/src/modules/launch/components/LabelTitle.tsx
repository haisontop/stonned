import { Avatar, HStack, Stack, Text, TextProps } from "@chakra-ui/react";
import React from "react";
import { useColorModeValue } from "@chakra-ui/system";

interface LabelTitleProps {
  label: string;
  title?: string;
  titleSize?: "sm" | "md" | "lg";
  mt?: number;
  titleColor?: string;
  labelColor?: string;
  textAlign?: TextProps["textAlign"];
}

export default function LabelTitle(props: LabelTitleProps) {
  const {
    label,
    title,
    titleSize,
    labelColor,
    titleColor,
    textAlign = "center",
  } = props;
  const labelTextColor = labelColor
    ? labelColor
    : useColorModeValue("#888888", "#AAAAAA");
  const titleTextColor = titleColor
    ? titleColor
    : useColorModeValue("#000", "#fff");

  const titleFonts = React.useMemo(() => {
    let fontStyle = Object.assign({
      fontSize: ["1rem", "1rem", "1rem"],
    });
    switch (titleSize) {
      case "sm":
        break;

      case "md":
        fontStyle.fontSize = ["1rem", "1rem"];
        break;

      case "lg":
        fontStyle.fontSize = ["1rem", "1.25rem", "1.5rem"];
        break;

      default:
        break;
    }

    return fontStyle;
  }, [titleSize]);

  return (
    <Stack spacing={0}>
      <Text
        mt={props.mt ?? 0}
        fontSize=".75rem"
        color={labelTextColor}
        fontWeight={500}
        textAlign={textAlign}
      >
        {label}
      </Text>
      <Text
        fontSize={titleFonts.fontSize}
        color={titleTextColor}
        fontWeight={600}
        textAlign={textAlign}
      >
        {title}
      </Text>
    </Stack>
  );
}
