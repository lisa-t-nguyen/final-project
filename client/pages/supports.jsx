import React from 'react';
import Box from '@mui/material/Box';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Stack from '@mui/material/Stack';

const drawerWidth = 240;

export default class Supports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gradeLevel: '',
      yearStart: '',
      yearEnd: ''
    };
  }

  render() {
    return (
      <Box sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` }
      }}
      >
        <Box sx={{ marginLeft: 3, marginTop: 3 }}>
          <Stack direction="row" spacing={2} sx={{ display: 'flex', alignItems: 'center', marginBottom: 0.5 }}>
            <AccountCircleIcon sx={{ fontSize: 45, color: 'gray' }} />
            <h2 style={{ fontFamily: 'Poppins' }}>Supports</h2>
          </Stack>
        </Box>
        <Box sx={{ borderBottom: 'solid', borderColor: '#4B6869' }} />
      </Box>
    );
  }
}
