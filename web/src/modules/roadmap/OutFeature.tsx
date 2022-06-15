import { Badge, Box, Image, Text } from "@chakra-ui/react";
import React from "react";

export default function OutFeature() {
  return (
    <Box position="relative">
      <Box
        backgroundColor="lightGery"
        pt="3rem"
        px="2.563rem"
        pb="1.438rem"
        borderRadius="md"
        w={["100%", "21.875rem"]}
        position={["static", "static", "absolute"]}
        left="20%"
        top="50px"
        mt={["1rem", "1rem", "0rem"]}
        boxShadow="md"
      >
        <Text as="p" fontSize="1.25rem" fontWeight="semibold">
          AC Weed Strain
        </Text>
        <Text as="p" fontSize="0.875rem" textColor="noneDark" mt="0.50rem">
          Yep, we are doin this. Puff Puff
        </Text>
      </Box>
      <Box
        backgroundColor="lightGery"
        px="2rem"
        py="1.60rem"
        borderRadius="md"
        position={["static", "static", "absolute"]}
        top="0%"
        right="10"
        w={["100%", "50%", "30%"]}
        mt={["1rem", "1rem", "0rem"]}
        boxShadow="md"
      >
        <Image src="/images/rectangle.png" mx="auto" w="100%" h="105px" />
        <Box w={["100%", "16.25rem"]} mx="auto">
          <Badge
            variant="solid"
            colorScheme="yellow"
            mt="0.80rem"
            fontSize="0.625rem"
            fontWeight="semibold"
          >
            Happening on 22th June 2022
          </Badge>
          <Text as="h5" fontSize="1.25rem" fontWeight="semibold" mt="1.50rem">
            Stoned Launch Party
          </Text>
          <Text
            fontSize="14px"
            fontWeight="medium"
            mt="0.72rem"
            textColor="noneDark"
          >
            Amsterdam here we fuck*n come! <br /> Puff Puff
          </Text>
        </Box>
      </Box>
      <Box
        backgroundColor="lightGery"
        px="2rem"
        py="1.60rem"
        borderRadius="md"
        position={["static", "static", "absolute"]}
        top="300"
        left="0"
        w={["100%", "50%", "30%"]}
        mt={["1rem", "1rem", "0rem"]}
        boxShadow="md"
      >
        <Image src="/images/rectangle.png" mx="auto" w="100%" h="105px" />
        <Box w={["100%", "16.25rem"]} mx="auto">
          <Badge
            variant="solid"
            colorScheme="green"
            fontWeight="semibold"
            mt="0.80rem"
            fontSize="0.625rem"
          >
            Soon 👀
          </Badge>
          <Text as="h5" fontSize="1.25rem" fontWeight="semibold" mt="1.50rem">
            CBD & Fashion Online Store
          </Text>
          <Text
            fontSize="14px"
            fontWeight="medium"
            mt="0.72rem"
            textColor="noneDark"
          >
            Expect top notch products
          </Text>
        </Box>
      </Box>
      <Box
        backgroundColor="lightGery"
        px="2rem"
        py="1.60rem"
        borderRadius="md"
        position={["static", "static", "absolute"]}
        top="480"
        w={["100%", "50%", "30%"]}
        mt={["1rem", "1rem", "0rem"]}
        left="35%"
        boxShadow="md"
      >
        <Image src="/images/rectangle.png" mx="auto" w="100%" h="105px" />
        <Box w={["100%", "16.25rem"]} mx="auto">
          <Badge
            variant="solid"
            colorScheme="green"
            fontWeight="semibold"
            mt="0.80rem"
            fontSize="0.625rem"
          >
            Soon 👀
          </Badge>
          <Text as="h5" fontSize="1.25rem" fontWeight="semibold" mt="1.50rem">
            Ape Awakening
          </Text>
          <Text
            fontSize="14px"
            fontWeight="medium"
            mt="0.72rem"
            textColor="noneDark"
          >
            Get your Nuked and Stoned Apes <br /> moving by awakening them.
          </Text>
        </Box>
      </Box>
      <Box
        backgroundColor="lightGery"
        pt="3rem"
        px="2.563rem"
        pb="1.438rem"
        borderRadius="md"
        w={["100%", "21.875rem"]}
        position={["static", "static", "absolute"]}
        right="-10px"
        top="400"
        mt={["1rem", "1rem", "0rem"]}
        boxShadow="md"
      >
        <Text as="p" fontSize="1.25rem" fontWeight="semibold">
          Community Stage
        </Text>
        <Text as="p" fontSize="0.875rem" textColor="noneDark" mt="0.50rem">
          Cause we ain’t doing this alone.
        </Text>
      </Box>
      <Box
        backgroundColor="lightGery"
        pt="3rem"
        px="2.563rem"
        pb="1.438rem"
        borderRadius="md"
        w={["100%", "21.875rem"]}
        position={["static", "static", "absolute"]}
        right="-10px"
        top="750"
        mt={["1rem", "1rem", "0rem"]}
        boxShadow="md"
      >
        <Text as="p" fontSize="1.25rem" fontWeight="semibold">
          Around the world <br /> GIF Collection
        </Text>
        <Text as="p" fontSize="0.875rem" textColor="noneDark" mt="0.50rem">
          Yep, we are doin this. Puff Puff
        </Text>
      </Box>
      <Box
        backgroundColor="lightGery"
        pt="3rem"
        px="2.563rem"
        pb="1.438rem"
        borderRadius="md"
        w={["100%", "21.875rem"]}
        position={["static", "static", "absolute"]}
        left="0"
        top="900"
        mt={["1rem", "1rem", "0rem"]}
        boxShadow="md"
      >
        <Text as="p" fontSize="1.25rem" fontWeight="semibold">
          Stoned Entertainment
        </Text>
        <Text as="p" fontSize="0.875rem" textColor="noneDark" mt="0.50rem">
          Puff Puff
        </Text>
      </Box>
      <Box
        backgroundColor="lightGery"
        pt="3rem"
        px="2.563rem"
        pb="1.438rem"
        borderRadius="md"
        w={["100%", "21.875rem"]}
        position={["static", "static", "absolute"]}
        right="30%"
        mt={["1rem", "1rem", "0rem"]}
        top="1000"
        boxShadow="md"
      >
        <Text as="p" fontSize="1.25rem" fontWeight="semibold">
          {" "}
        </Text>
        <Text as="p" fontSize="1.25rem" fontWeight="semibold">
          And a lot more...
        </Text>
      </Box>
    </Box>
  );
}
