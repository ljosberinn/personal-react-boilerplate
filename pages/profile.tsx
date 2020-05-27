import React from 'react';

import { User } from '../src/client/context/AuthContext/AuthContext';
import { authenticatedFetch } from '../src/client/utils/fetcher';
import { withSession } from '../src/client/utils/withSession';

interface ProfileProps {
  data: User;
  todo: Todo;
}

export default function Profile({ data, todo }: ProfileProps) {
  return (
    <h1>
      {JSON.stringify(data)} <br />
      {JSON.stringify(todo)}
    </h1>
  );
}

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const getServerSideProps = withSession(async ({ req }, session) => {
  const json = await authenticatedFetch.get<Todo>(['user', 'todo'], req);

  return {
    props: {
      data: session,
      todo: json,
    },
  };
});
