import { InputWithIconComponent } from '../atoms/InputWithIconComponent';
import { ButtonComponent } from '@/components/atoms/ButtonComponent';
import { AlertComponent } from '@/components/atoms/AlertComponent';
import { LinkComponent } from '../atoms/LinkComponent';
import React, { FormEvent, useState } from 'react';
import { useLoginMutation } from '@/redux/auth/slice';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLock2Line } from 'react-icons/ri';
import { useRouter } from 'next/router';
import { formValidation, ValidationResult } from '@/helpers/validationHelper';
import { errorHandler } from '@/helpers/errorHandlerHelper';

export const LoginComponent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validation, setVaridation] = useState<ValidationResult>({ invalid: false });
  const [login] = useLoginMutation();
  const router = useRouter();

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    // これを入れているのは、リロードが走らないようにするため
    event.preventDefault();

    const data = {
      email,
      password,
    };
    const validationResult = formValidation(data);

    if (!validationResult.invalid) {
      try {
        await login(data)
          .unwrap()
          .then(() => {
            router.replace('/main');
          })
          .catch(errorHandler);
      } catch (e) {
        console.error(e);
      }
    }

    setVaridation(validationResult);
  };

  return (
    <>
      <div className='border border-black'>
        <h2 className='text-center text-2xl my-6'>ログイン</h2>
        <div
          id='login-error-display'
          className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto xl:w-3/5 w-4/5 hidden'
          role='alert'
        >
          <span id='login-error-message' className='block sm:inline'></span>
        </div>

        <form id='login-form' onSubmit={handleLogin}>
          <div
            className={
              'mt-12 mx-auto xl:w-3/5 w-4/5' + (validation.email ? ' border-2 border-solid border-red-600' : '')
            }
          >
            <InputWithIconComponent<string>
              id='email'
              name='email'
              type='text'
              value={email}
              placeholder='メールアドレス'
              icon={<AiOutlineMail />}
              setter={setEmail}
            />
          </div>
          <div className={'mx-auto xl:w-3/5 w-4/5' + (validation.email ? ' h-6' : '')}>
            {validation.email && <AlertComponent text={validation.email} />}
          </div>
          <div
            className={
              'mx-auto xl:w-3/5 w-4/5' +
              (validation.password ? ' border-2 border-solid border-red-600' : '') +
              (validation.email ? '' : ' mt-6')
            }
          >
            <InputWithIconComponent<string>
              id='password'
              name='password'
              type='password'
              value={password}
              placeholder='パスワード'
              icon={<RiLock2Line />}
              setter={setPassword}
            />
          </div>
          <div className={'mx-auto xl:w-3/5 w-4/5 ' + (validation.password ? ' h-6' : '')}>
            {validation.password && <AlertComponent text={validation.password} />}
          </div>
          <div className={'text-center mx-auto xl:w-1/5 w-2/5 ' + (validation.password ? '' : ' mt-6')}>
            <ButtonComponent type='submit' children='ログイン' />
          </div>
        </form>
        <div>
          <p className='mt-4 text-center text-sm'>
            サインアップは
            <LinkComponent href='/auth/signup' text='こちら' />
          </p>
          {/* <p className='mt-2 mb-4 text-center text-sm'>
            パスワードを忘れた方は
            <LinkComponent href='/auth/resetPassword/sendResetPasswordMail' text='こちら' />
          </p> */}
        </div>
      </div>
    </>
  );
};
