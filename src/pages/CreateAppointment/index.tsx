import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, StatusBar, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  CalendarTitle,
  OpenDatePickerButton,
  OpenDatePickerText
} from './styles';

interface RouteParams{
  providerId: string;
}

export interface Provider {
  id: string;
  name: string;
  avatarUrl: string;
}

StatusBar.setBackgroundColor('#28262e');

const CreateAppointment: React.FC = () => {
  const { user } = useAuth();
  const route = useRoute();
  const { goBack } = useNavigation();
  const routeParams = route.params as RouteParams;

  const [providers, setProvider] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(routeParams.providerId);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    api.get('/providers').then((response) => {
      setProvider(response.data);
    });
  }, []);

  const handleBackButton = useCallback(() => {
    goBack();
  }, [goBack]);

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId);
  }, [setSelectedProvider]);

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker((oldState) => !oldState);
  }, [setShowDatePicker]);

  const handleDateChange = useCallback((event: any, date: Date | undefined) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
    }
  }, []);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBackButton}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>

      <ProvidersListContainer>
        <ProvidersList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={providers}
          keyExtractor={(provider) => provider.id}
          renderItem={({ item: provider }) => (
            <ProviderContainer
              onPress={() => handleSelectProvider(provider.id)}
              selected={provider.id === selectedProvider}
            >
              <ProviderAvatar source={{ uri: provider.avatarUrl }} />
              <ProviderName
                selected={provider.id === selectedProvider}
              >
                {provider.name}
              </ProviderName>
            </ProviderContainer>
          )}
        />
      </ProvidersListContainer>
      <Calendar>

        <CalendarTitle>Escolha a data</CalendarTitle>

        <OpenDatePickerButton onPress={handleToggleDatePicker}>
          <OpenDatePickerText>Selecionar outra data</OpenDatePickerText>
        </OpenDatePickerButton>

        {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          textColor="#f4ede8"
          onChange={handleDateChange}
        />
        )}
      </Calendar>

      <Text>{`${selectedDate}`}</Text>

    </Container>
  );
};

export default CreateAppointment;
