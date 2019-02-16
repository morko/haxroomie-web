import React from 'react';
import { Button } from 'reactstrap';

import './SmallButton.css';

export default function SmallButton(props) {
  return (
    <Button className="SmallButton" size='sm' outline color="secondary" onClick={props.onClick}>
      {props.children}
    </Button>
  )
}
