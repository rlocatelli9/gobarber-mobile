import { useNavigation, useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import React, { useCallback, useMemo } from 'react';
import Icon from 'react-native-vector-icons/Feather';

import {
  Container,
  CustomTitle,
  Description,
  AgreeButton,
  AgreeButtonText
} from './styles';

interface RouteParams {
  date: number;
}

const AppointmentCreated: React.FC = () => {
  const { reset } = useNavigation();
  const { params } = useRoute();
  const routeParams = params as RouteParams;

  const formatedDate = useMemo(() => format(
    routeParams.date, "EEEE', dia' dd 'de' MMMM 'de' yyyy 'às' HH'h'",
    { locale: ptBR }
  ), [routeParams]);

  const handleAgreePressed = useCallback(() => {
    reset({
      routes: [
        { name: 'Dashboard' },
      ],
      index: 0,
    });
  }, [reset]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />
      <CustomTitle>Agendamento concluído</CustomTitle>
      <Description>{formatedDate}</Description>

      <AgreeButton onPress={handleAgreePressed}>
        <AgreeButtonText>Ok!</AgreeButtonText>
      </AgreeButton>
    </Container>
  );
};

export default AppointmentCreated;
