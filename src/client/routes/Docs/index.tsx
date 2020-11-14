// import { Tab, chakra, TabList, Icon, Tabs } from '@chakra-ui/react';
// import { AiOutlineStock } from 'react-icons/ai';
// import { FaReact, FaPaintBrush, FaLock } from 'react-icons/fa';
// import { GiLifeTap } from 'react-icons/gi';
// import { GrTest } from 'react-icons/gr';
// import { MdLoop, MdTranslate } from 'react-icons/md';
// import { SiTypescript } from 'react-icons/si';

// import { InternalLink } from '../../components/InternalLink';
import { Box, Container, Heading, useColorModeValue } from '@chakra-ui/react';

export function DocsIndex(): JSX.Element {
  const bg = useColorModeValue('cyan.50', 'gray.800');

  return (
    <Box as="main" bg={bg} borderBottom="1px solid" borderColor="gray.700">
      <Container
        d="flex"
        maxWidth={{ base: '100%', md: '85%' }}
        pt={40}
        pb={12}
        mx="auto"
        justifyContent="center"
        alignContent="center"
        flexDirection={{ base: 'column', lg: 'row' }}
        textAlign={{ base: 'center', lg: 'initial' }}
      >
        <Heading>under construction :]</Heading>
      </Container>
    </Box>
  );

  // return (
  //   <>
  //     <chakra.aside p={16}>
  //       <Tabs size="lg" display="flex">
  //         <TabList flexDirection="column" borderBottom="initial">
  //           <InternalLink
  //             as={Tab}
  //             omitTextDecoration
  //             href="/next-js"
  //             justifyContent="initial"
  //           >
  //             <Icon as={FaReact} mr={2} />
  //             Next.js
  //           </InternalLink>
  //           <Tab justifyContent="initial">
  //             <Icon as={SiTypescript} mr={2} />
  //             TypeScript
  //           </Tab>
  //           <Tab justifyContent="initial">
  //             <Icon as={FaPaintBrush} mr={2} />
  //             UI Library
  //           </Tab>
  //           <Tab justifyContent="initial">
  //             <Icon as={MdTranslate} mr={2} />
  //             Internationalization
  //           </Tab>
  //           <Tab justifyContent="initial">
  //             <Icon as={FaLock} mr={2} />
  //             Authentication
  //           </Tab>
  //           <Tab justifyContent="initial">
  //             <Icon as={AiOutlineStock} mr={2} />
  //             Monitoring
  //           </Tab>
  //           <Tab justifyContent="initial">
  //             <Icon
  //               as={GrTest}
  //               sx={{ path: { stroke: 'currentColor' } }}
  //               mr={2}
  //             />
  //             Testing
  //           </Tab>
  //           <Tab justifyContent="initial">
  //             <Icon as={MdLoop} mr={2} />
  //             CI & CD
  //           </Tab>
  //           <Tab justifyContent="initial">
  //             <Icon as={GiLifeTap} mr={2} />
  //             DX / QoL
  //           </Tab>
  //         </TabList>
  //       </Tabs>
  //     </chakra.aside>
  //     <main />
  //   </>
  // );
}
