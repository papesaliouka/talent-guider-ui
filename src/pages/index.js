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
  

    const [thisWeekchartSeries, setThisWeekChartSeries] = useState([]);
    const [thisWeekTotalHours, setThisWeekTotalHours] = useState(0);
    const [thisWeektraffic, setThisWeekTraffic] = useState([]);
    const [thisWeeklogEntries, setThisWeekLogEntries] = useState(0);
    
    const [lastWeekchartSeries, setLastWeekChartSeries] = useState([]);
    
  
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
        let json = await res.json();
        if (!json){
          return;
        }

        
        if (json.length === 0){
          return;
        }

        if (json.length === 1){
          const totalOfWeek = json[0].totalOfWeek;
          setThisWeekTotalHours(Math.round(totalOfWeek/60));
          setThisWeekLogEntries(json[0].days.length);
          const tripples = makeTriplles(json[0].days, json[0].durations, json[0].subjectNames, json[0].date);
          const durationsByDay = makeDurationsByDay(tripples);
          const {chartSeries} = makeChartSeriesAndCategories(durationsByDay);
          setThisWeekChartSeries(chartSeries);
          const durationBySubject = makeDurationBySubject(tripples);
          const traffic = makeTraffic(durationBySubject);
          setThisWeekTraffic(traffic);
          return;
        }

        if (json.length === 2){
          json = json.sort((a, b) => {
            return  a._id - b._id;
          });
          const totalOfWeek = json[0].totalOfWeek;
          setThisWeekTotalHours(Math.round(totalOfWeek/60));
          setThisWeekLogEntries(json[0].days.length);
          const tripples = makeTriplles(json[0].days, json[0].durations, json[0].subjectNames, json[0].date);
          const durationsByDay = makeDurationsByDay(tripples);
          const {chartSeries} = makeChartSeriesAndCategories(durationsByDay);
          setThisWeekChartSeries(chartSeries);
          const durationBySubject = makeDurationBySubject(tripples);
          const traffic = makeTraffic(durationBySubject);
          setThisWeekTraffic(traffic);


          const totalOfLastWeek = json[1].totalOfWeek;
          const logEntriesOfLastWeek = json[1].days.length;
          const tripplesOfLastWeek = makeTriplles(json[1].days, json[1].durations, json[1].subjectNames, json[1].date);
          const durationsByDayOfLastWeek = makeDurationsByDay(tripplesOfLastWeek);
          const {chartSeries: chartSeriesOfLastWeek} = makeChartSeriesAndCategories(durationsByDayOfLastWeek);
          setLastWeekChartSeries(chartSeriesOfLastWeek);
          return;
        }


        

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
              value={thisWeekTotalHours}
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
              value={thisWeeklogEntries}
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
                  name: 'Last Week',
                  data: lastWeekchartSeries
                },
                {
                  name: 'This Week',
                  data: thisWeekchartSeries
                }
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            lg={6}
          >
            <OverviewTraffic
                traffic={thisWeektraffic} 
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