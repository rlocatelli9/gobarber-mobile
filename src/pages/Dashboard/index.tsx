import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';

import { useAuth } from '../../context/AuthContext';

import {
  Container, Header, HeaderTitle, UserName, ProfileButton, UserAvatar
} from './styles';

const Dashboard: React.FC = () => {
  StatusBar.setBackgroundColor('#28262e');
  const { signOut, user } = useAuth();
  const { navigate } = useNavigation();

  const navigateProfile = useCallback(() => {
    navigate('Profile');
  }, [navigate]);

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem-vindo,
          {'\n'}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateProfile}>
          <UserAvatar source={{ uri: user.avatarUrl }} />
        </ProfileButton>
      </Header>
    </Container>
  );
};

export default Dashboard;
