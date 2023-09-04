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

const API_URL = process.env.NEXT_PUBLIC_API_URL 


const Page = () =>{
  

    const [chartSeries, setChartSeries] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [traffic, setTraffic] = useState([]);
    const [logEntries, setLogEntries] = useState(0);
  
    const initialRender = useRef(false);

  useEffect(() =>{

    if (initialRender.current) {
      return;
    }

    initialRender.current = true;

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


        const totalOfWeek = json.reduce((acc, curr) => acc + curr.totalOfWeek, 0);
        setTotalHours(Math.round(totalOfWeek/60));

        const days= json.map((item) => item.days).flat();
        const durations = json.map((item) => item.durations).flat();
        const subjectNames = json.map((item) => item.subjectNames).flat();
        const dates = json.map((item) => item.date).flat();

        setLogEntries(days.length);

        const tripples = makeTriplles(days, durations, subjectNames, dates);

        const durationsByDay = makeDurationsByDay(tripples);

        const {chartSeries,categories} = makeChartSeriesAndCategories(durationsByDay);
        setChartSeries(chartSeries);

        setCategories(categories);

        const durationBySubject = makeDurationBySubject(tripples);

        const traffic = makeTraffic(durationBySubject);
        setTraffic(traffic);
        return;

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