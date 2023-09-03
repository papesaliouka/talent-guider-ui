import PropTypes from 'prop-types';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import { Chart } from 'src/components/chart';

const useChartOptions = (labels) => {
  const theme = useTheme();

  return {
    chart: {
      background: 'transparent'
    },
    dataLabels: {
      enabled: false
    },
    labels,
    legend: {
      show: false
    },
    plotOptions: {
      pie: {
        expandOnClick: false
      }
    },
    states: {
      active: {
        filter: {
          type: 'none'
        }
      },
      hover: {
        filter: {
          type: 'none'
        }
      }
    },
    stroke: {
      width: 0
    },
    theme: {
      mode: theme.palette.mode
    },
    tooltip: {
      fillSeriesColor: false
    }
  };
};


export const OverviewTraffic = (props) => {
  const { traffic, sx } = props;
  
  const labels = traffic.map(({subject}) => subject);  
  const chartSeries = traffic.map(({duration}) => duration);
  const chartOptions = useChartOptions(labels);
  

  return (
    <Card sx={sx}>
      <CardHeader title="Subjects Overview" />
      { chartSeries >0 ? (

      <CardContent>
        <Chart
          height={300}
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width="100%"
        />
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 2 }}
        >
          {traffic.map(({subject,duration}) => {
            return (
              <Box
                key={subject}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                <Typography
                  sx={{ my: 1 }}
                  variant="h6"
                >
                  {subject}
                </Typography>
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                >
                  {duration}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
      ):(
        <CardContent>
          <Typography
            color="text.secondary"
            variant="h6"
          >
            No data to display yet 
          </Typography>
        </CardContent>
      )
      }
    
    </Card>
  );
};

OverviewTraffic.propTypes = {
  traffic: PropTypes.array.isRequired,
  sx: PropTypes.object
};