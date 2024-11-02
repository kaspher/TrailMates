import React, { useState, useEffect } from 'react';
import { green, red } from '@mui/material/colors';
import { Snackbar, Alert, LinearProgress } from '@mui/material';

const CustomAlert = React.forwardRef((_, ref) => {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [severity, setSeverity] = useState('success');
    const [progress, setProgress] = useState(100); 
    const autoHideDuration = 6000; 

    const showAlert = (msg, severityLevel = 'success') => {
        setMessage(msg);
        setSeverity(severityLevel);
        setOpen(true);
        setProgress(100); 
    };

    const handleClose = () => {
        setOpen(false);
    };

    React.useImperativeHandle(ref, () => ({
        showAlert
    }));

    useEffect(() => {
        if (open) {
            const startTime = Date.now();

            const interval = setInterval(() => {
                const elapsedTime = Date.now() - startTime;
                const progressValue = 100 - (elapsedTime / autoHideDuration) * 100;

                setProgress(progressValue);

                if (progressValue < 0) {
                    clearInterval(interval);
                    setOpen(false);
                }
            }, 50);

            return () => clearInterval(interval);
        }
    }, [open]);

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                {message}
                <LinearProgress
                    variant="determinate"
                    value={progress}
                    sx={{
                        mt: 1,
                        bgcolor: severity === 'success' ? green[100] : red[100],
                        '& .MuiLinearProgress-bar': {
                            bgcolor: severity === 'success' ? green[500] : red[500],
                        },
                    }}
                />
            </Alert>
        </Snackbar>
    );
});

export default CustomAlert;
