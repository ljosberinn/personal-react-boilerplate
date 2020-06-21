import {
  Text,
  Box,
  Heading,
  List,
  ListItem,
  useColorModeValue,
} from '@chakra-ui/core';
import { WarningIcon } from '@chakra-ui/icons';
import React from 'react';

interface DemoComponentProps {
  component: JSX.Element;
  title: string;
  description: string | JSX.Element;
  warning?: string;
  features: (JSX.Element | string)[];
}

export default function DemoComponent({
  component,
  title,
  description,
  warning,
  features,
}: DemoComponentProps) {
  const id = title.toLowerCase();
  const color = useColorModeValue('red.600', 'red.300');

  return (
    <Box as="article" m={4} id={id}>
      <a href={`#${id}`}>
        <Heading as="h3" size="md">
          <Text as="span" color="grey">
            #
          </Text>{' '}
          {title}
        </Heading>
      </a>

      <Box as="p" mt={2}>
        {description}
      </Box>

      <List styleType="disc" stylePosition="inside" m={4}>
        {features.map((feature, index) => (
          <ListItem key={index}>{feature}</ListItem>
        ))}
      </List>

      <Box>{component}</Box>

      {warning && (
        <Box as="small" color={color}>
          <em>
            <WarningIcon color={color} sx={undefined} /> {warning}
          </em>
        </Box>
      )}
    </Box>
  );
}
