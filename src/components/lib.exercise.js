import styled from '@emotion/styled/macro'
import {keyframes} from '@emotion/core'
import {Dialog as ReachDialog} from '@reach/dialog'

// components
import {FaSpinner} from 'react-icons/fa'; // extra 3 spinner icon

// default styles
import * as mq from 'styles/media-queries';
import * as color from 'styles/colors';

// extra 3 spinner icon
const spin = keyframes({
  '0%': {transform: 'rotate(0deg)'},
  '100%': {transform: 'rotate(360deg)'},
});
const Spinner = styled(FaSpinner)({
    animation: `${spin} 1s linear infinite`
});
Spinner.defaultProps = {
    'aria-label': 'Loading'
};

const buttonVariants = {
  primary: {
    background: color.indigo,
    color: color.base,
  },
  secondary: {
    background: color.gray,
    color: color.text,
  },
}
const Button = styled.button(
  {
    padding: '10px 15px',
    border: '0',
    lineHeight: '1',
    borderRadius: '3px',
  },
  ({variant = 'primary'}) => buttonVariants[variant],
)

const Input = styled.input({
  borderRadius: '3px',
  border: `1px solid ${color.gray10}`,
  background: color.gray,
  padding: '8px 12px',
})

const CircleButton = styled.button({
  borderRadius: '30px',
  padding: '0',
  width: '40px',
  height: '40px',
  lineHeight: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: color.base,
  color: color.text,
  border: `1px solid ${color.gray10}`,
  cursor: 'pointer',
})

const Dialog = styled(ReachDialog)({
  maxWidth: '450px',
  borderRadius: '3px',
  paddingBottom: '3.5em',
  boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.2)',
  margin: '20vh auto',
  [mq.small]: {
    width: '100%',
    margin: '10vh auto',
  },
})

const FormGroup = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

export {Button, Input, CircleButton, Dialog, FormGroup, Spinner}
