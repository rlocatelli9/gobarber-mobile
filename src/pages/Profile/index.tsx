import React, { useCallback, useRef } from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import Icon from 'react-native-vector-icons/Feather';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import LogoImage from '../../assets/logo.png';
import Button from '../../components/Button';
import Input from '../../components/Input';
import {
  Container,
  BackButton,
  UserAvatarButton,
  UserAvatarImage,
  CustomTitle,
  Title
} from './styles';
import { useAuth } from '../../context/AuthContext';

interface ProfileFormData {
  name: string;
  email: string;
  password: string;
}

const Profile = () => {
  const formRef = useRef<FormHandles>(null);
  const oldPasswordInputRef = useRef<TextInput>(null);
  const newPasswordInputRef = useRef<TextInput>(null);
  const confirmationPasswordInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const navigation = useNavigation();
  const { user } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});
        const schema = Yup.object().shape({
          name: Yup.string().required('Nome Obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(6, 'No mínimo 6 dígitos'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.post('users', data);

        Alert.alert(
          'Cadastro com sucesso!',
          'Você já pode fazer login na aplicação',
        );

        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Erro no cadastro!',
          'Erro durante cadastro. Tente novamente!',
        );
      }
    },
    [navigation],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={Platform.OS === 'android' ? { flexGrow: 1 } : { flex: 1 }}
        >
          <Container>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <UserAvatarButton onPress={() => {}}>
              <UserAvatarImage source={{ uri: user.avatarUrl }} />
            </UserAvatarButton>

            <CustomTitle>
              <Title style={{ textAlign: 'left' }}>Meu Perfil</Title>
            </CustomTitle>

            <Form onSubmit={handleSubmit} ref={formRef} style={{ width: '100%' }}>
              <Input
                name="name"
                icon="user"
                placeholder="Nome"
                returnKeyType="next"
                autoCapitalize="words"
                onSubmitEditing={() => {
                  emailInputRef.current?.focus();
                }}
              />
              <Input
                ref={emailInputRef}
                autoCorrect={false}
                autoCapitalize="none"
                name="email"
                keyboardType="email-address"
                autoCompleteType="email"
                icon="mail"
                placeholder="E-mail"
                returnKeyType="next"
                onSubmitEditing={() => {
                  oldPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={oldPasswordInputRef}
                name="oldPassword"
                icon="lock"
                textContentType="password"
                placeholder="Senha atual"
                returnKeyType="next"
                containerStyle={{ marginTop: 16 }}
                secureTextEntry
                onSubmitEditing={() => {
                  newPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={newPasswordInputRef}
                name="newPassword"
                icon="lock"
                textContentType="newPassword"
                placeholder="Nova senha"
                returnKeyType="next"
                secureTextEntry
                onSubmitEditing={() => {
                  confirmationPasswordInputRef.current?.focus();
                }}
              />
              <Input
                ref={confirmationPasswordInputRef}
                name="passwordConfirmation"
                icon="lock"
                placeholder="Confirmação de senha"
                returnKeyType="send"
                secureTextEntry
                onSubmitEditing={() => {
                  formRef.current?.submitForm();
                }}
              />

              <Button onPress={() => {
                formRef.current?.submitForm();
              }}
              >
                Confirmar mudança

              </Button>
            </Form>

          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

    </>
  );
};

export default Profile;
