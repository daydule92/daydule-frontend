import { useRouter } from 'next/router';
import React, { FormEvent, useState, useRef } from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import { RiLock2Line } from 'react-icons/ri';
import { AlertComponent } from '@/components/common/leaf/AlertComponent';
import { InputWithIconComponent } from '@/components/common/leaf/InputWithIconComponent';
import { LinkComponent } from '@/components/common/leaf/LinkComponent';
import { ButtonComponent } from '@/components/common/tree/ButtonComponent';
import { errorHandler } from '@/helpers/errorHandlerHelper';
import { formValidation, ValidationResult } from '@/helpers/validationHelper';
import { SignupForm, useSignupMutation } from '@/redux/auth/slice';

export const SignupComponent = () => {
  const [validation, setValidation] = useState<ValidationResult>({ invalid: false });
  const inputEmailRef = useRef<HTMLInputElement>(null);
  const inputPasswordRef = useRef<HTMLInputElement>(null);
  const inputPasswordConfirmationRef = useRef<HTMLInputElement>(null);
  const [signup] = useSignupMutation();
  const router = useRouter();

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    // これを入れているのは、リロードが走らないようにするため
    event.preventDefault();

    const data: SignupForm = {
      email: inputEmailRef.current?.value ?? '',
      password: inputPasswordRef.current?.value ?? '',
      passwordConfirmation: inputPasswordConfirmationRef.current?.value ?? '',
    };

    const validationResult = formValidation(data);

    if (!validationResult.invalid) {
      try {
        await signup(data)
          .unwrap()
          .then(() => router.replace('/main'))
          .catch(errorHandler);
      } catch (e) {
        console.error(e);
      }
    }

    setValidation(validationResult);
  };

  return (
    <>
      <div className='border border-black'>
        <h2 className='my-6 text-center text-2xl'>サインアップ</h2>
        <div
          id='signup-error-display'
          className='relative mx-auto hidden w-4/5 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700 xl:w-3/5'
          role='alert'
        >
          <span id='signup-error-message' className='block sm:inline'></span>
        </div>

        <form id='signup-form' onSubmit={handleSignup}>
          <div
            className={
              'mt-12 mx-auto xl:w-3/5 w-4/5' + (validation.email ? ' border-2 border-solid border-red-600' : '')
            }
          >
            <InputWithIconComponent
              id='email'
              name='email'
              type='text'
              placeholder='メールアドレス'
              icon={<AiOutlineMail />}
              customRef={inputEmailRef}
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
            <InputWithIconComponent
              id='password'
              name='password'
              type='password'
              placeholder='パスワード'
              icon={<RiLock2Line />}
              customRef={inputPasswordRef}
            />
          </div>
          <div className={'mx-auto xl:w-3/5 w-4/5' + (validation.password ? ' h-6' : '')}>
            {validation.password && <AlertComponent text={validation.password} />}
          </div>
          <div
            className={
              'mx-auto xl:w-3/5 w-4/5 ' +
              (validation.passwordConfirmation ? 'border-2 border-solid border-red-600' : '') +
              (validation.password ? '' : ' mt-6')
            }
          >
            <InputWithIconComponent
              id='password-confirmation'
              name='password-confirmation'
              type='password'
              placeholder='パスワード再入力'
              icon={<RiLock2Line />}
              customRef={inputPasswordConfirmationRef}
            />
          </div>
          <div className={'mx-auto xl:w-3/5 w-4/5 ' + (validation.passwordConfirmation ? 'h-6' : '')}>
            {validation.passwordConfirmation && <AlertComponent text={validation.passwordConfirmation} />}
          </div>
          <div className={'mb-4 text-center mx-auto xl:w-1/5 w-2/5' + (validation.passwordConfirmation ? '' : ' mt-6')}>
            <ButtonComponent type='submit' children='サインアップ' />
          </div>
        </form>
        <div>
          <p className='my-4 text-center text-sm'>
            ログインは
            <LinkComponent href='/auth/login' text='こちら' />
          </p>
        </div>
      </div>
    </>
  );
};
