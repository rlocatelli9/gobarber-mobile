import React from 'react';
import { Button } from 'react-native';

import { useAuth } from '../../context/AuthContext';

import { Container } from './styles';

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();
  return (
    <Container>
      <Button title="sair" onPress={signOut} />
    </Container>
  );
};

export default Dashboard;
