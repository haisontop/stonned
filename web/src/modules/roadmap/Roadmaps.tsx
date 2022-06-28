import {
  Container,
  Heading,
  Stack,
  Box,
  Text,
  Grid,
  GridItem,
  Flex,
  Skeleton,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import React, { useCallback, useMemo, useState } from "react";
import { FaEquals } from "react-icons/fa";
import { CgClose } from "react-icons/cg";
import { MainLayout } from "../../layouts/MainLayout";
import Footer from "../nuked/Footer";
import { VISION_LIST } from "./constants";
import OurJourney from "./OurJourney";
import OutFeature from "./OutFeature";
import RoadmapCard from "./RoadmapCard";
import { useAllRoadmaps } from "./roadmapHooks";
import { Roadmap, Vision } from "./types";
import { motion, useAnimation } from "framer-motion";

interface RoadmapMainCardProps {
  vision: Vision;
  onOpen: (vision: Vision) => void;
  onClose: () => void;
  expanded: boolean;
  showInitial?: boolean;
}

const spring = {
  type: "spring",
  default: { duration: 0.4 },
};

const RoadmapMainCard = (props: RoadmapMainCardProps) => {
  const { vision, onOpen, onClose, expanded, showInitial } = props;

  const variants = {
    expand: {
      width: "100%",
      display: "block",
      transition: { duration: 0 },
    },
    hidden: {
      width: 0,
      display: "none",
      transition: { duration: 0 },
    },
  };

  const handleExpand = () => {
    onOpen(vision);
  };

  const renderContent = useCallback(() => {
    return (
      <>
        <motion.div
          initial="expand"
          animate={showInitial || expanded ? "expand" : "hidden"}
          variants={variants}
        >
          <motion.div
            layout
            transition={spring}
            style={{ flexShrink: 1, originX: 0, originY: 0 }}
          >
            {expanded && !showInitial ? (
              <Box
                textAlign="center"
                display="flex"
                flexDir={"column"}
                alignItems="center"
                bgColor={"#F9F9F9"}
                p={["2.5rem 2.75rem"]}
                width="100%"
                position={"relative"}
              >
                <IconButton
                  icon={<CgClose />}
                  aria-label={"Close Expanded Vision"}
                  onClick={onClose}
                  sx={{
                    position: "absolute",
                    top: "0.5rem",
                    right: "0.5rem",
                    border: "unset",
                    background: "transparent",
                  }}
                ></IconButton>
                <Grid
                  width="100%"
                  templateColumns={[
                    "repeat(1, 1fr)",
                    "repeat(2, 1fr)",
                    "repeat(9, 1fr)",
                  ]}
                  columnGap={["4.5rem"]}
                >
                  <GridItem colSpan={[1, 1, 4]} sx={{ position: "relative" }}>
                    <Stack width="100%" alignItems={"flex-end"}>
                      <Text as="h3" fontSize="20px" fontWeight="bold">
                        {vision.title}
                      </Text>
                      <Box
                        height={["13.6rem"]}
                        bgColor="#C4C4C4"
                        width="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Text as="h3" fontSize="20px" fontWeight="bold">
                          Art
                        </Text>
                      </Box>
                    </Stack>
                    <Box
                      color={"rgba(146, 146, 146, 0.3)"}
                      sx={{
                        position: "absolute",
                        top: "0.3rem",
                        right: "-2.75rem",
                      }}
                    >
                      <FaEquals />
                    </Box>
                  </GridItem>
                  <GridItem colSpan={[1, 1, 5]}>
                    <Stack width="100%" alignItems={"flex-start"}>
                      <Text
                        as="h3"
                        fontSize="20px"
                        fontWeight="bold"
                        textAlign="left"
                      >
                        {vision.subtitle}
                      </Text>
                      <Text as="h3" fontSize={["0.875rem"]} textAlign="left">
                        {vision.description}
                      </Text>
                    </Stack>
                  </GridItem>
                </Grid>
              </Box>
            ) : (
              <Box
                textAlign="center"
                display="flex"
                flexDir={"column"}
                alignItems="center"
                bgColor={"#F9F9F9"}
                p={["2rem 2.75rem"]}
                onClick={handleExpand}
                _hover={{
                  cursor: "pointer",
                }}
              >
                <Box
                  height={["13.6rem"]}
                  bgColor="#C4C4C4"
                  width="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text as="h3" fontSize="20px" fontWeight="bold">
                    Art
                  </Text>
                </Box>
                <Text as="h3" fontSize="20px" fontWeight="bold" mt="1.5rem">
                  {vision.title}
                </Text>
                <Box my="0.5rem" color={"rgba(146, 146, 146, 0.3)"}>
                  <FaEquals />
                </Box>
                <Text as="h3" fontSize="20px" fontWeight="bold">
                  {vision.subtitle}
                </Text>
              </Box>
            )}
          </motion.div>
        </motion.div>
      </>
    );
  }, [expanded, vision, onOpen, onClose]);

  return <>{renderContent()}</>;
};

const Roadmaps = () => {
  const roadmapRes = useAllRoadmaps();
  const isLoading = roadmapRes.isLoading;

  const [openedVision, setOpenedVision] = useState<Vision | null>(null);

  const handleCloseVision = () => {
    setOpenedVision(null);
  };

  const handleOpenVision = (vision: Vision) => {
    setOpenedVision(vision);
  };

  return (
    <MainLayout
      navbar={{
        colorTheme: "light",
        bgTransparent: true,
      }}
    >
      <Container
        w="100vw"
        maxW="70.75rem"
        minH="100vh"
        pt={["5rem", "6rem", "6rem"]}
        pb={["4rem", "4rem", "6rem"]}
      >
        <Box textAlign={"center"}>
          <Heading
            color="#000"
            fontWeight={700}
            as="h1"
            fontSize={{ base: "2rem", lg: "2.5rem" }}
            transition="all .2s ease-in-out"
          >
            Our Vision & Values
          </Heading>
          <Text
            mt={["1rem", "1rem", "2.5rem"]}
            fontSize={"0.875rem"}
            fontWeight={500}
          >
            We are guided by our builder mentality to create beautiful art,
            community and fuck*n dope products.
          </Text>
        </Box>
        <Grid
          templateColumns={
            openedVision
              ? ["repeat(1, 1fr)"]
              : ["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]
          }
          mt={["1rem", "1rem", "3rem"]}
          columnGap={["1rem", "2rem", "6rem"]}
          rowGap={["1rem"]}
        >
          {VISION_LIST.map((vision) => (
            <GridItem
              colSpan={
                openedVision && openedVision.id === vision.id ? [3] : [1]
              }
              borderRadius="sm"
              backgroundColor="lightGery"
              key={vision.id}
            >
              <RoadmapMainCard
                vision={vision}
                onOpen={handleOpenVision}
                onClose={handleCloseVision}
                expanded={!!openedVision && openedVision.id === vision.id}
                showInitial={!openedVision}
              />
            </GridItem>
          ))}
        </Grid>
        <OurJourney />

        <OutFeature />
        {/* <Grid
            templateColumns={[
              "repeat(1, 1fr)",
              "repeat(2, 1fr)",
              "repeat(3, 1fr)",
            ]}
            columnGap="1.625rem"
            rowGap="2.5rem"
          >
            {isLoading ? (
              <>
                <GridItem>
                  <Skeleton width="100%" height="12.5rem" />
                </GridItem>
                <GridItem>
                  <Skeleton height="12.5rem" />
                </GridItem>
                <GridItem>
                  <Skeleton height="12.5rem" />
                </GridItem>
              </>
            ) : (
              roadmapRes.data.map((roadmap: Roadmap) => (
                <GridItem key={roadmap.id} id={roadmap.id}>
                  <RoadmapCard roadmap={roadmap} />
                </GridItem>
              ))
            )}
          </Grid> */}
        <Box mt={["2rem", "5rem", "70rem"]} mb="6rem">
          <Text
            textAlign={"center"}
            fontSize="1.25rem"
            fontFamily={"heading"}
            fontWeight={600}
          >
            Expect the unexpected
          </Text>
        </Box>

        <Box pos="absolute" bottom="0" left="50%" transform="translateX(-50%)">
          <Footer theme={"light"}></Footer>
        </Box>
      </Container>
    </MainLayout>
  );
};

export default Roadmaps;
