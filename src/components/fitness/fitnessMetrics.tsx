import { Box, Button, Divider, Grid, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridPaginationModel, GridValueGetterParams } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppConst, fitnessDataPerPage, notificationType } from '../../constants/AppConst';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import { FitnessData } from '../../models/fitnessModels';
import { format } from 'date-fns';
import Header from '../header/Header';
import FitnessWidget from './fitnessWidget';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { showNotificationMsg } from '../../services/createNotification';

function FitnessMetrics() {
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: fitnessDataPerPage,
        page: 0,
    });
    const [fitnessData, setFitnessData] = useState<FitnessData | null>(null);


    useEffect(() => {
        getFitnessData();
    }, [paginationModel.page]);

    useEffect(() => {
        const tokenDetails = localStorage.getItem(AppConst.storageKeys.accessToken);
        if (!tokenDetails) {
            showNotificationMsg("You need to login first.", notificationType.WARNING);
            navigate("/auth/login");
            return;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const getFitnessData = async () => {
        const res = await axiosProtectedInstance.get(`/api/v1/fitness/getFitnessData/${paginationModel.pageSize}/${paginationModel.page}`);
        if (res.data?.length) {
            setFitnessData(res.data[0]);
        }
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
                `${format(new Date(params.row.walkDateTime), 'dd/MM/yy HH:mm')}`
        },
        {
            field: 'distanceKm',
            headerName: 'Distance',
            description: 'Distance in km',
            sortable: true,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.distanceKm} km`
        },
        {
            field: 'durationMinutes',
            headerName: 'Duration',
            description: 'Duration in minutes',
            sortable: true,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.durationMinutes} min`
        },
        {
            field: 'caloriesBurned',
            headerName: 'Calories',
            description: 'Calories burned',
            sortable: true,
            flex: 1,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.caloriesBurned} kcal`
        },
    ];


    const renderFitnessData = () => {
        return <Box sx={{ height: 400, width: '100%', marginTop: "20px" }}>
            <DataGrid
                getRowClassName={(params) =>
                    params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
                }
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#9c27b0', // Purple background
                        color: 'white',             // White text
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 'bold',         // Bold header text
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
                rows={fitnessData?.last30Entries?.[0]?.records || []}
                localeText={{ noRowsLabel: `No data found.` }}
                autoPageSize={true}
                autoHeight={true}
                disableColumnMenu={true}
                paginationModel={paginationModel}
                rowCount={fitnessData?.totalCount?.[0]?.count || 0}
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
                marginLeft: "auto",
                marginRight: "auto",
                gap: "20px"
            }}>
                <Divider />
                <Button color="secondary" variant="text" sx={{ alignSelf: "flex-end", marginRight:"20px" }} size="medium" onClick={() => { navigate('/fitness/addFitnessData') }}>Add Fitness data</Button>
                <Typography variant='h6' className="section-head font-20">
                    Weekly Progress Report
                </Typography>
                <Grid container spacing={3} sx={{ p: 3 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Calories Burned"
                            value={fitnessData?.last7Days[0]?.totalCalories?.toFixed(2) || 0}
                            unit={'kcal'}
                            icon={<LocalFireDepartmentIcon fontSize="medium" />}
                            color="#FF5722"
                            progress={100}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Distance Traveled"
                            value={fitnessData?.last7Days[0]?.totalDistance?.toFixed(2) || 0}
                            unit={'km'}
                            icon={<DirectionsWalkIcon fontSize="medium" />}
                            color="#4CAF50"
                            progress={100}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Active Minutes"
                            value={fitnessData?.last7Days[0]?.totalDuration?.toFixed(2) || 0}
                            unit={'minutes'}
                            icon={<AccessTimeIcon fontSize="medium" />}
                            color="#2196F3"
                            progress={100}
                        />
                    </Grid>
                </Grid>
                <Divider />
                <Typography variant='h6' className="section-head font-20">
                    Monthly Progress Report
                </Typography>
                <Grid container spacing={3} sx={{ p: 3 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Calories Burned"
                            value={fitnessData?.last30Days[0]?.totalCalories?.toFixed(2) || 0}
                            unit={'kcal'}
                            icon={<LocalFireDepartmentIcon fontSize="medium" />}
                            color="#FF5722"
                            progress={100}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Distance Traveled"
                            value={fitnessData?.last30Days[0]?.totalDistance?.toFixed(2) || 0}
                            unit={'km'}
                            icon={<DirectionsWalkIcon fontSize="medium" />}
                            color="#4CAF50"
                            progress={100}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Active Minutes"
                            value={fitnessData?.last30Days[0]?.totalDuration?.toFixed(2) || 0}
                            unit={'minutes'}
                            icon={<AccessTimeIcon fontSize="medium" />}
                            color="#2196F3"
                            progress={100}
                        />
                    </Grid>
                </Grid>
                <Divider />
                <Typography variant='h6' className="section-head font-20">
                    Overall Progress Report
                </Typography>
                <Grid container spacing={3} sx={{ p: 3 }}>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Calories Burned"
                            value={fitnessData?.allTime[0]?.totalCalories?.toFixed(2) || 0}
                            unit={'kcal'}
                            icon={<LocalFireDepartmentIcon fontSize="medium" />}
                            color="#FF5722"
                            progress={100}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Distance Traveled"
                            value={fitnessData?.allTime[0]?.totalDistance?.toFixed(2) || 0}
                            unit={'km'}
                            icon={<DirectionsWalkIcon fontSize="medium" />}
                            color="#4CAF50"
                            progress={100}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <FitnessWidget
                            title="Active Minutes"
                            value={fitnessData?.allTime[0]?.totalDuration?.toFixed(2) || 0}
                            unit={'minutes'}
                            icon={<AccessTimeIcon fontSize="medium" />}
                            color="#2196F3"
                            progress={100}
                        />
                    </Grid>
                </Grid>
                <Divider />

                <Typography variant='h6' className="section-head font-20">
                    Walkpad data
                </Typography>
                {renderFitnessData()}
            </Box>
        </>
    )
}

export default FitnessMetrics;