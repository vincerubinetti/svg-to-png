import React from 'react';

import './cell.css';

// generic cell/control component
export const Cell = ({ style, tooltip, text, icon, controlId, control }) => (
  <div className='cell' style={style} title={tooltip}>
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
