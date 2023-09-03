import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Overview } from 'src/sections/overview/overview-budget';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import {useEffect, useState, useRef} from 'react';

import {makeTriplles,
  makeDurationsByDay,
  makeChartSeriesAndCategories,
  makeDurationBySubject,
  makeTraffic} from 'src/utils/overview-helpers';

const API_URL = process.env.API_URL || 'http://localhost:8000'



const Page = () =>{
  

    const [chartSeries, setChartSeries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [traffic, setTraffic] = useState([]);
    const [logEntries, setLogEntries] = useState(0);
  
  const isMountedRef = useRef(null);

  useEffect(() =>{
    if (isMountedRef.current){
      return;
    }
    isMountedRef.current = true;
    const fetchData = async () =>{
      try{
        const res = await fetch(`${API_URL}/api/tasks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            },
          credentials: 'include'
        });
        const json = await res.json();
        if (!json){
          return;
        }
        setTotalHours(Math.round(json[0].totalOfWeek/60));

        const days= json[0].days;
        const durations = json[0].durations;
        const subjectNames = json[0].subjectNames;
        const dates = json[0].date;

        setLogEntries(days.length);

        
        const tripples = makeTriplles(days, durations, subjectNames, dates);

        const durationsByDay = makeDurationsByDay(tripples);

        const {chartSeries,categories} = makeChartSeriesAndCategories(durationsByDay);
        setChartSeries(chartSeries);

        setCategories(categories);
        
        const durationBySubject = makeDurationBySubject(tripples);

        const traffic = makeTraffic(durationBySubject);
        setTraffic(traffic);


        return
      }catch (err){
        console.log(err);
      }
    };
    fetchData();
  }, []);


  return( 
  <>
    <Head>
      <title>
        Overview | Talent Guider
      </title>
    </Head>
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        py: 8
      }}
    >
      <Container maxWidth="xl">
        <Grid
          container
          spacing={3}
        >
          <Grid
            xs={12}
            sm={12}
            lg={6}
          >
            <Overview
              sx={{ height: '100%' }}
              value={totalHours}
              difference={1}
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            lg={6}
          >
          <Overview
              sx={{ height: '100%' }}
              value={logEntries}
              difference={0}
              title="Logs Entries (past 7 days)"
            />
          </Grid>
          <Grid
            xs={12}
            lg={6}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'Hours',
                  data: chartSeries
                }
              ]}
              sx={{ height: '100%' }}
              categories={categories}
            />
          </Grid>
          <Grid
            xs={12}
            lg={6}
          >
            <OverviewTraffic
                traffic={traffic} 
                sx={{ height: '100%' }} 
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
)
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;