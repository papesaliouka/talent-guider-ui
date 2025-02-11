import Head from 'next/head';
import { Box, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { Overview } from 'src/sections/overview/overview-budget';
import { OverviewSales } from 'src/sections/overview/overview-sales';
import { OverviewTraffic } from 'src/sections/overview/overview-traffic';
import {OverviewTasksProgress  } from 'src/sections/overview/overview-tasks-progress';
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
    const [lastWeekTotalHours, setLastWeekTotalHours] = useState(0);
    const [lastWeekLogEntries, setLastWeekLogEntries] = useState(0);
    
    const [thisWeekCommits, setThisWeekCommits] = useState(0);
    const [lastWeekCommits, setLastWeekCommits] = useState(0);
  
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
            return b._id - a._id;
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
          setLastWeekTotalHours(Math.round(totalOfLastWeek/60));
          const logEntriesOfLastWeek = json[1].days.length;
          setLastWeekLogEntries(logEntriesOfLastWeek);
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

    const fetchCommits = async () =>{
        try{
          const res = await fetch(`${API_URL}/api/commits`, {
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
            setThisWeekCommits(json[0].total);
            return;
          }
          if (json.length === 2){
            setThisWeekCommits(json[0].total);
            setLastWeekCommits(json[1].total);
            return;
          }
        }catch (err){
          console.log(err);
        }
    };

    Promise.all([fetchData(), fetchCommits()]);

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
            lg={3}
          >
            <Overview
              sx={{ height: '100%' }}
              value={thisWeekTotalHours}
              difference={thisWeekTotalHours - lastWeekTotalHours}
              title="Total Hours (This Week)"
              positive={thisWeekTotalHours > lastWeekTotalHours}
              clock
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            lg={3}
          >
          <Overview
              sx={{ height: '100%' }}
              value={thisWeeklogEntries}
              difference={thisWeeklogEntries - lastWeekLogEntries}
              title="Logs Entries (This Week)"
              positive={thisWeeklogEntries > lastWeekLogEntries }
              list
            />
          </Grid>
          <Grid      
            xs={12}
            sm={12}
            lg={3}
          >
          <Overview
              sx={{ height: '100%' }}
              value={thisWeekCommits }
              difference={thisWeekCommits - lastWeekCommits}
              title="Commit Messages (This Week)"
              positive={thisWeekCommits > lastWeekCommits}
              mail
            />
          </Grid>
          <Grid
            xs={12}
            sm={12}
            lg={3}
          >
            <OverviewTasksProgress
              sx={{ height: '100%' }}
              value={thisWeekTotalHours}
            />
            
          </Grid> 

          <Grid
            xs={12}
            lg={7}
          >
            <OverviewSales
              chartSeries={[
                {
                  name: 'This Week',
                  data: thisWeekchartSeries
                },
                {
                  name: 'Last Week',
                  data: lastWeekchartSeries
                },
              ]}
              sx={{ height: '100%' }}
            />
          </Grid>
          <Grid
            xs={12}
            lg={5}
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