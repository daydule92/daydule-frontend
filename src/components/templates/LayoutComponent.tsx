import { ReactNode } from 'react';
import { FooterComponent } from '@/components/atoms/FooterComponent';
import { HeaderComponent } from '@/components/organisms/HeaderComponent';

type Props = {
  children: ReactNode;
};

const LayoutComponent = (props: Props) => {
  return (
    <div className='h-screen w-full border border-white bg-white'>
      <HeaderComponent />
      <div className='mx-4 mb-8 mt-20 h-[calc(100%_-_7rem)] w-[calc(100%_-_2rem)] border border-white'>
        {props.children}
      </div>
      <FooterComponent />
    </div>
  );
};

export default LayoutComponent;
