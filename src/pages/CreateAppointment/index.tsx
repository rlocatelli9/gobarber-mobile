import { useNavigation, useRoute } from '@react-navigation/native';
import React, {
  useCallback, useEffect, useMemo, useState
} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform, StatusBar } from 'react-native';
import { format } from 'date-fns';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

import {
  Container,
  Content,
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
  OpenDatePickerText,
  CustomSchedule,
  ScheduleTitle,
  SectionContent,
  Section,
  SectionTitle,
  Hour,
  HourText,
} from './styles';

interface DayAvailabilityItem {
  hour: number;
  available: boolean;
}
interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}
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
  const [dayAvailability, setDayAvailability] = useState<DayAvailabilityItem[]>([]);
  const [selectedHour, setSelectedHour] = useState(0);

  useEffect(() => {
    api.get('/providers').then((response) => {
      setProvider(response.data);
    });
  }, []);

  useEffect(() => {
    api.get(`/providers/${selectedProvider}/day-availability`, {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then((response) => {
      setDayAvailability(response.data);
      console.log('dayAvailability: ', response.data);
    });
  }, [selectedProvider, selectedDate]);

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

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const morningAvailability = useMemo(() => dayAvailability
    .filter(({ hour }) => hour < 12)
    .map(({ hour, available }) => ({
      hour,
      available,
      formatedHour: format(new Date().setHours(hour), 'HH:00')
    })), [dayAvailability]);

  const afternoonAvailability = useMemo(() => dayAvailability
    .filter(({ hour }) => hour >= 12)
    .map(({ hour, available }) => ({
      hour,
      available,
      formatedHour: format(new Date().setHours(hour), 'HH:00')
    })), [dayAvailability]);

  return (
    <Container>
      <Header>
        <BackButton onPress={handleBackButton}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>
        <HeaderTitle>Cabeleireiros</HeaderTitle>

        <UserAvatar source={{ uri: user.avatarUrl }} />
      </Header>

      <Content>
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
            {...(Platform.OS === 'ios' ? { textColor: '#f4ede8' } : {})}
            onChange={handleDateChange}
          />
          )}
        </Calendar>

        <CustomSchedule>
          <ScheduleTitle>Escolha o horário</ScheduleTitle>

          <Section>
            <SectionTitle>Manhã</SectionTitle>

            <SectionContent>
              {morningAvailability.map(({ hour, formatedHour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={formatedHour}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>{formatedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>

            <SectionContent>
              {afternoonAvailability.map(({ hour, formatedHour, available }) => (
                <Hour
                  enabled={available}
                  selected={selectedHour === hour}
                  available={available}
                  key={formatedHour}
                  onPress={() => handleSelectHour(hour)}
                >
                  <HourText selected={selectedHour === hour}>{formatedHour}</HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>
        </CustomSchedule>
      </Content>

    </Container>
  );
};

export default CreateAppointment;
