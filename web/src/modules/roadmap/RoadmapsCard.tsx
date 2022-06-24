import { Box, GridItem, IconButton, Image, Text, Link } from "@chakra-ui/react";
import React from "react";
import { FaEquals } from "react-icons/fa";

interface props {
  id: number;
  title: string;
  slogan: string;
  details: string;
}

export default function RoadmapsCard({ title, slogan, details, id }: props) {
  return (
    <GridItem
      colSpan={[1]}
      borderRadius="sm"
      backgroundColor="lightGery"
      py={7}
    >
      <Link href={`/roadmap/${id}`}>
        <Image src="/images/rectangle.png" mx="auto" />
        <Box textAlign="center" mt="6">
          <Text as="h3" fontSize="20px" fontWeight="bold">
            {title}
          </Text>
          <IconButton
            aria-label="icon-button"
            icon={<FaEquals />}
            border="none"
            textColor="DarkLinghtGrey"
            backgroundColor="lightGery"
          />
          <Text as="h3" fontSize="20px" fontWeight="bold">
            {slogan}
          </Text>
        </Box>
      </Link>
    </GridItem>
  );
}
