import { Box, Heading, List, ListItem, Icon } from '@chakra-ui/core';
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
  return (
    <Box as="article" m={4}>
      <Heading as="h3" size="md">
        {title}
      </Heading>

      <Box as="p" mt={2}>
        {description}
      </Box>

      <List styleType="disc" m={4}>
        {features.map((feature, index) => (
          <ListItem key={index}>{feature}</ListItem>
        ))}
      </List>
      {component}
      {warning && (
        <Box as="small" color="red.500">
          <em>
            <Icon name="warning" color="red.500" /> {warning}
          </em>
        </Box>
      )}
    </Box>
  );
}
