import React from 'react'

import { Map } from 'lucide-react';
import { Container } from './container';

interface Props {
  className?: string;
}

export const Login: React.FC<Props> = () => {
  return (
    <Container >
      <div className='items-center justify-center grid'>    
        <p className='text-lg font-bold text-white'>Войти в систему</p>
        
      </div>
    </Container>
  )
}

export default Login