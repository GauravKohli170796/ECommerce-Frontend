import { Box, Button, Card, Divider, Grid, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppConst, fitnessDataPerPage, notificationType } from '../../constants/AppConst';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import { FitnessData, SummaryEntry } from '../../models/fitnessModels';
import { format } from 'date-fns';
import Header from '../header/Header';
import { showNotificationMsg } from '../../services/createNotification';
import CalendarGrid from './fitnessCalenderView';
import HealthWidget from './HealthWidget';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StairsOutlinedIcon from '@mui/icons-material/StairsOutlined';
import { Gauge, gaugeClasses } from '@mui/x-charts';

function FitnessMetrics() {
    const navigate = useNavigate();
    const stepFactor = 75;
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: fitnessDataPerPage,
        page: 0,
    });
    const [fitnessMetrics, setFitnessMetrics] = useState<FitnessData | null>(null);
    const [fitnessData, setFitnessData] = useState<SummaryEntry[] | null>(null);
    const [selectedFilter, setSelectedFilter] = useState("default");
    const filterOptions: { [key: string]: string } = {
        clh: "Calories low to high",
        chl: "Calories high to low",
        dlh: "Distance low to high",
        dhl: "Distance high to low",
        dulh: "Duration low to high",
        duhl: "Duration high to low",
    };

    useEffect(() => {
        getFitnessData();
    }, [paginationModel.page, selectedFilter]);

    useEffect(() => {
        getFitnessMetrics();
    }, []);

    useEffect(() => {
        const tokenDetails = localStorage.getItem(AppConst.storageKeys.accessToken);
        if (!tokenDetails) {
            showNotificationMsg("You need to login first.", notificationType.WARNING);
            navigate("/auth/login");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const getFitnessMetrics = async () => {
        const res = await axiosProtectedInstance.get(`/api/v1/fitness/getFitnessMetrics`);
        if (res.data?.length) {
            setFitnessMetrics(res.data[0]);
        }
    }

    const getFitnessData = async () => {
        const res = await axiosProtectedInstance.get(`/api/v1/fitness/getFitnessData/${paginationModel.pageSize}/${paginationModel.page}/${selectedFilter}`);
        if (res.data?.length) {
            setFitnessData(res.data);
        }
    }

    const renderFilterOptions = () => {
        const filters = [
            <MenuItem disabled value="default">Select a filter</MenuItem>
        ];
        for (const key in filterOptions) {
            filters.push(<MenuItem key={key} value={key}>{filterOptions[key]}</MenuItem>)
        }
        return filters;
    }


    const handlePageChange = (model: GridPaginationModel) => {
        setPaginationModel({ ...paginationModel, page: model.page });
    }

    const columns: GridColDef[] = [
        {
            field: 'walkDateTime',
            headerName: 'Date/Time',
            description: 'Day and time on which you walked',
            sortable: false,
            flex: 1.5,
            valueGetter: (params: GridValueGetterParams) =>
                `${format(new Date(params.row.walkDateTime), 'dd MMM yy HH:mm')}`
        },
        {
            field: 'distanceKm',
            headerName: 'Distance',
            description: 'Distance in km',
            sortable: false,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.distanceKm} km`
        },
        {
            field: 'durationMinutes',
            headerName: 'Duration',
            description: 'Duration in minutes',
            sortable: false,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.durationMinutes} min`
        },
        {
            field: 'caloriesBurned',
            headerName: 'Calories',
            description: 'Calories burned',
            sortable: false,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.caloriesBurned} kcal`
        },
    ];


    const renderFitnessData = () => {
        return <Box sx={{ width: '100%', maxWidth: "1302px", marginTop: "20px" }}>
            <Box sx={{ marginBottom: "20px", display: "flex", justifyContent: "flex-end", mr: { xs: 0.5 } }}>
                <Select
                    size="small"
                    variant="outlined"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedFilter}
                    color="secondary"
                    onChange={(e: SelectChangeEvent) => setSelectedFilter(e.target.value)}
                    displayEmpty
                >
                    {renderFilterOptions()}
                </Select>

            </Box>
            <DataGrid
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#9c27b0',
                        color: 'white',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',
                    },

                    "& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer": {
                        display: "none"
                    },
                    '& .odd': {
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? '#1e1e1e' : '#f5f5f5',
                    },
                    '& .even': {
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? '#121212' : 'white',
                    },
                }}
                rows={fitnessData || []}
                localeText={{ noRowsLabel: `No data found.` }}
                autoPageSize={true}
                autoHeight={true}
                disableColumnMenu={true}
                paginationModel={paginationModel}
                rowCount={fitnessMetrics?.totalCount?.[0]?.count || 0}
                columns={columns}
                getRowId={(row) => row._id}
                paginationMode='server'
                disableRowSelectionOnClick
                onPaginationModelChange={handlePageChange}
            />
        </Box>
    }

    return (
        <>
            <Header />
            <Box sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                maxWidth: "1350px",
                marginX: "auto",
                gap: "10px",
                marginBottom: "60px",
                background: "#f8f9fa"
            }}>
                <Button color="secondary" variant="text" sx={{ alignSelf: "flex-end", marginRight: "20px" }} size="medium" onClick={() => { navigate('/fitness/addFitnessData') }}>Add Fitness data</Button>
                <HealthWidget
                    title={`Weekly Report - (${fitnessMetrics?.last7Days[0]?.totalDays || 0} days)`}
                    totalSteps={parseInt((((fitnessMetrics?.last7Days[0]?.totalDistance || 0) * 100000) / stepFactor).toString())}
                    totalCalories={fitnessMetrics?.last7Days[0]?.totalCalories || 0}
                    totalDuration={fitnessMetrics?.last7Days[0]?.totalDuration || 0}
                    totalDistance={fitnessMetrics?.last7Days[0]?.totalDistance || 0}
                    goalCaloriesBurned={fitnessMetrics?.last7Days[0]?.goalCaloriesBurned || 0}
                    goalDistanceKm={fitnessMetrics?.last7Days[0]?.goalDistanceKm || 0}
                    goalDurationMinutes={fitnessMetrics?.last7Days[0]?.goalDurationMinutes || 0}
                    goalStepsWalk={fitnessMetrics?.last7Days[0]?.goalStepsWalk || 0}
                    totalDays={fitnessMetrics?.last7Days[0]?.totalDays || 0}
                />
                <HealthWidget
                    title={`Monthly Report - (${fitnessMetrics?.last30Days[0]?.totalDays || 0} days)`}
                    totalSteps={parseInt((((fitnessMetrics?.last30Days[0]?.totalDistance || 0) * 100000) / stepFactor).toString())}
                    totalCalories={fitnessMetrics?.last30Days[0]?.totalCalories || 0}
                    totalDuration={fitnessMetrics?.last30Days[0]?.totalDuration || 0}
                    totalDistance={fitnessMetrics?.last30Days[0]?.totalDistance || 0}
                    goalCaloriesBurned={fitnessMetrics?.last30Days[0]?.goalCaloriesBurned || 0}
                    goalDistanceKm={fitnessMetrics?.last30Days[0]?.goalDistanceKm || 0}
                    goalDurationMinutes={fitnessMetrics?.last30Days[0]?.goalDurationMinutes || 0}
                    goalStepsWalk={fitnessMetrics?.last30Days[0]?.goalStepsWalk || 0}
                    totalDays={fitnessMetrics?.last30Days[0]?.totalDays || 0}
                />
                <HealthWidget
                    title={`Overall Report - (${fitnessMetrics?.allTime[0]?.totalDays || 0} days)`}
                    totalSteps={parseInt((((fitnessMetrics?.allTime[0]?.totalDistance || 0) * 100000) / stepFactor).toString())}
                    totalCalories={fitnessMetrics?.allTime[0]?.totalCalories || 0}
                    totalDuration={fitnessMetrics?.allTime[0]?.totalDuration || 0}
                    totalDistance={fitnessMetrics?.allTime[0]?.totalDistance || 0}
                    goalCaloriesBurned={fitnessMetrics?.allTime[0]?.goalCaloriesBurned || 0}
                    goalDistanceKm={fitnessMetrics?.allTime[0]?.goalDistanceKm || 0}
                    goalDurationMinutes={fitnessMetrics?.allTime[0]?.goalDurationMinutes || 0}
                    goalStepsWalk={fitnessMetrics?.allTime[0]?.goalStepsWalk || 0}
                    totalDays={fitnessMetrics?.allTime[0]?.totalDays || 0}
                />
                <CalendarGrid />
                {renderFitnessData()}
            </Box>
        </>
    )
}

export default FitnessMetrics;