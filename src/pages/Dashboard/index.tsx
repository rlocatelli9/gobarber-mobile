import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControlBase, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

import {
  Container,
  Header,
  HeaderTitle,
  UserName,
  ProfileButton,
  UserAvatar,
  ProvidersList,
  ProvidersListTitle,
  ProviderContainer,
  ProviderAvatar,
  ProviderInfo,
  ProviderName,
  ProviderMeta,
  ProviderMetaText
} from './styles';

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
}

StatusBar.setBackgroundColor('#28262e');

const Dashboard: React.FC = () => {
  const [providers, setProvider] = useState<Provider[]>([]);
  const { signOut, user } = useAuth();
  const { navigate } = useNavigation();

  useEffect(() => {
    api.get('/providers').then((response) => {
      setProvider(response.data);
    });
  }, []);

  const navigateProfile = useCallback(() => {
    // navigate('Profile');
    signOut();
  }, [signOut]);

  const navigateToCreateAppointment = useCallback((providerId: string) => {
    navigate('CreateAppointment', { providerId });
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

      <ProvidersList
        data={providers}
        keyExtractor={(provider) => provider.id}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({ item: provider }) => (
          <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
            <ProviderAvatar source={{ uri: provider.avatarUrl }} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#ff9000" />
                <ProviderMetaText>Segunda à Sábado</ProviderMetaText>
              </ProviderMeta>

              <ProviderMeta>
                <Icon name="clock" size={14} color="#ff9000" />
                <ProviderMetaText>08h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
