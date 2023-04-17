import { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';


const MyAlert = ({ severity, children }) => {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
        setOpen(false);
      }, 5000);
  }, [])

  return (
    <div>
      {open && (
        <Alert severity={severity} onClose={handleClose}>
          {children}
        </Alert>
      )}
    </div>
  );
};

export default MyAlert;