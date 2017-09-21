import React from 'react';
import IconButton from 'material-ui/IconButton';
import SvgIcon from 'material-ui/SvgIcon';


export const DeleteIcon = (props) => {
  return (
    <IconButton tooltip='Delete' tooltipPosition='top-center'>
      <SvgIcon {...props}>
        <path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
      </SvgIcon>
    </IconButton>
  );
};

export const EditIcon = (props) => {
  return (
    <IconButton tooltip='Edit' tooltipPosition='top-center'>
      <SvgIcon {...props}>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </SvgIcon>
    </IconButton>
  );
};
