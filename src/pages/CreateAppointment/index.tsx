import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../context/AuthContext';

import {
  Container, Header, BackButton, HeaderTitle, UserAvatar
} from './styles';

interface RouteParams{
  providerId: string;
}

StatusBar.setBackgroundColor('#28262e');

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();
  const { providerId } = route.params as RouteParams;

  const handleBackButton = useCallback(() => {
    goBack();
  }, [goBack]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBackButton}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>
    </Container>
  );
};

export default CreateAppointment;
