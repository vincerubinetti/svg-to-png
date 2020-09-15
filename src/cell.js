import React from 'react';

import './cell.css';
import './tooltip.css';

// generic cell/control component
export const Cell = ({
  style,
  tooltip,
  text,
  icon,
  controlId,
  control,
  color,
  disabled
}) => (
  <div className='cell' style={{ ...style, color }} data-tooltip={tooltip}>
    {(text || icon) && (
      <div className='header' disabled={disabled ? true : undefined}>
        {text && <span>{text}</span>}
        {icon && <i className={icon}></i>}
      </div>
    )}
    {control && (
      <div
        id={controlId}
        className='control'
        disabled={disabled ? true : undefined}
      >
        {control}
      </div>
    )}
  </div>
);
