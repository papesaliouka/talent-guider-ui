import PropTypes from 'prop-types';
import ArrowDownIcon from '@heroicons/react/24/solid/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import CurrencyDollarIcon from '@heroicons/react/24/solid/CurrencyDollarIcon';
import ListBulletIcon from '@heroicons/react/24/solid/ListBulletIcon';
import BookOpenIcon from '@heroicons/react/24/solid/BookOpenIcon';
import ClockIcon from '@heroicons/react/24/solid/ClockIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';

export const Overview = (props) => {
  const { clock,list,mail ,title,difference, positive = false, sx, value } = props;

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              {title}
            </Typography>
          {value>0 && (
            <Typography variant="h4">
              {value}
            </Typography>
          )}
          </Stack>
        {clock &&
          <Avatar
            sx={{
              backgroundColor: 'error.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon >
              <ClockIcon/>
            </SvgIcon>
          </Avatar>
        }
        {list &&
          <Avatar
            sx={{
              backgroundColor: 'success.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon >
              <ListBulletIcon/>
            </SvgIcon>
          </Avatar>
        }
        {mail &&
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon >
              <BookOpenIcon/>
            </SvgIcon>
          </Avatar>
        }
        </Stack>
        {!!difference ? (
          <Stack
            alignItems="center"
            direction="row"
            spacing={2}
            sx={{ mt: 2 }}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={0.5}
            >
              <SvgIcon
                color={positive ? 'success' : 'error'}
                fontSize="small"
              >
                {positive ? <ArrowUpIcon /> : <ArrowDownIcon />}
              </SvgIcon>
              <Typography
                color={positive ? 'success.main' : 'error.main'}
                variant="body2"
              >
                {difference}%
              </Typography>
            </Stack>
            <Typography
              color="text.secondary"
              variant="caption"
            >
              Since last week
            </Typography>
          </Stack>
        )
          :
          <Typography
            color="text.secondary"
            variant="caption"
          >
            No Data to Display
            please start logging your hours
            and make sure you setup the webhook
          </Typography>
        }
        
        
      </CardContent>
    </Card>
  );
};

Overview.prototypes = {
  difference: PropTypes.number,
  positive: PropTypes.bool,
  sx: PropTypes.object,
  value: PropTypes.string.isRequired
};