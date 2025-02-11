import {
  Avatar,
  Box,
  Card,
  CardContent,
  Typography
} from '@mui/material';

const user = {
  avatar: '/assets/avatars/avatar-miron-vitold.png',
  city: 'Rufisque',
  country: 'Senegal',
  jobTitle: 'Senior Developer',
  name: 'Pape Saliou KA',
  timezone: 'GTM-0'
};

export const AccountProfile = () => (
  <Card>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 80,
            mb: 2,
            width: 80
          }}
        />
        <Typography
          gutterBottom
          variant="h5"
        >
          {user.name}
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user.city} {user.country}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);