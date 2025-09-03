import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRegisterMutation } from '../../features/auth.api';
import { Loader } from '../../components';
import { routes } from '../../routing';
import { useGetSpacesQuery } from '../../features/space.api';
import { toast } from 'react-toastify';
import { ArrowUpRight } from '../../components/Icons';
import { translate } from '../../i18n';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();
  const { data, isLoading: isSpacesLoading } = useGetSpacesQuery({});

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [space, setSpace] = useState('');

  const clearForm = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!space) {
      toast.error(translate('selectSpace'));
    } else {
      await registerUser({ name, email, password, space })
        .unwrap()
        .then(() => {
          clearForm();
          toast.success(
            'Welcome to Mereja Mahder. Please wait for an admin to verify and approve your account'
          );
          navigate('/');
        });
    }
  }

  if (!data) {
    return <Loader />;
  }

  return (
    <>
      <Loader show={isSpacesLoading} />
      <section className="flex flex-col justify-center items-center gap-5 w-full overflow-hidden md:gap-8">
        <form
          className="flex flex-col gap-3 w-full mb-0 text-[#202224] md:max-w-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-1">
            <label>{t('emailAddress')}</label>
            <input
              type="email"
              placeholder="Email"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>{t('username')}</label>
            <input
              type="text"
              placeholder="Name"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>{t('password')}</label>
            <input
              type="password"
              placeholder="Password"
              className="input rounded-md w-full bg-[#EBEBEB]"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-poppins-medium">{t('chooseSpace')}</p>
            <div className="flex flex-wrap justify-between items-center">
              {data.docs.map((space) => (
                <label key={space.id} className="label cursor-pointer">
                  <input
                    type="radio"
                    className="radio radio-xs radio-secondary mr-2"
                    name="spaces"
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onChange={(_e) => setSpace(space.id)}
                  />
                  <span className="label-text text-black text-sm">
                    {space.title === 'aff'
                      ? t('affFellow')
                      : space.title === 'community'
                        ? t('dhnCommunity')
                        : space.title === 'women_safe_space'
                          ? t('womenSafeSpaces')
                          : space.title}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-between items-center">
            <Link
              to={routes.ForgotPassword.absolute}
              className="text-secondary text-sm font-poppins-semi-bold"
            >
              {t('forgotPassword')}?
            </Link>
          </div>
          <button
            type="submit"
            aria-disabled={isLoading}
            className="flex cursor-pointer justify-between items-center bg-primary hover:bg-secondary hover:text-primary rounded-4xl p-2 ps-5 w-full md:max-w-[200px] md:ps-8"
          >
            <span>{t('register')}</span>
            {isLoading ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <div className="flex justify-center items-center rounded-full p-1 bg-secondary text-primary inverse-child-icon">
                <ArrowUpRight />
              </div>
            )}
          </button>
          <p className="text-sm text-secondary font-normal">
            {t('doHaveAccount')}?{' '}
            <Link
              to={routes.Login.absolute}
              className="text-black font-poppins-semi-bold"
            >
              {t('login')}
            </Link>
          </p>
        </form>
      </section>
    </>
  );
};

export default Register;
