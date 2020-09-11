import React from 'react';

import './cell.css';

// generic cell/control component
export const Cell = ({
  style,
  tooltip,
  text,
  icon,
  controlId,
  control,
  color
}) => (
  <div className='cell' style={{ ...style, color }} title={tooltip}>
    {(text || icon) && (
      <div className='header'>
        {text && <span>{text}</span>}
        {icon && <i className={icon}></i>}
      </div>
    )}
    {control && (
      <div id={controlId} className='control'>
        {control}
      </div>
    )}
  </div>
);
