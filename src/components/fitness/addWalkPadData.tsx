import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import { Button, Divider, InputAdornment, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { GetAppState } from '../../AppContext';
import { IGoalData, IWalkPadData } from '../../models/productModel';
import { DatePicker, TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useFormik } from 'formik';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import { showNotificationMsg } from '../../services/createNotification';
import { AppConst, notificationType } from '../../constants/AppConst';
import Header from '../header/Header';


const initialProductDetails: IWalkPadData = {
    email: "",
    note: "",
    walkDate: undefined,
    walkTime: undefined,
    durationMinutes: undefined,
    distanceKm: undefined,
    caloriesBurned: undefined,
}



function AddWalkPadData() {
    const AppState = GetAppState();
    const navigate = useNavigate();
    const [initialValues, setInitialValues] = useState<IGoalData>({
        email: "",
        goalDurationMinutes: undefined,
        goalDistanceKm: undefined,
        goalCaloriesBurned: undefined,
        goalStepsWalk: undefined,
    });

    useEffect(() => {
        const tokenDetails = localStorage.getItem(AppConst.storageKeys.accessToken);
        if (!tokenDetails) {
            showNotificationMsg("You need to login first.", notificationType.WARNING);
            navigate("/auth/login");
            return;
        }
        getGoalsData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [navigate]);

    const getGoalsData = async () => {
        const res = await axiosProtectedInstance.get(`/api/v1/fitness/getFitnessGoalsData`);
        if (res?.data) {
            const goalsData = res.data;
            const tmpInitialValues = { ...initialValues };
            tmpInitialValues.goalCaloriesBurned = goalsData.goalCaloriesBurned;
            tmpInitialValues.goalDistanceKm = goalsData.goalDistanceKm;
            tmpInitialValues.goalDurationMinutes = goalsData.goalDurationMinutes;
            tmpInitialValues.goalStepsWalk = goalsData.goalStepsWalk;
            setInitialValues(tmpInitialValues);
        }
    }

    const addWalkPadDataForm = useFormik<Partial<IWalkPadData>>({
        enableReinitialize: true,
        initialValues: initialProductDetails,
        validationSchema: Yup.object({
            note: Yup.string(),
            durationMinutes: Yup.number().required("Please fill duration walked (in min)").moreThan(0, 'Duration must be greater than 0'),
            distanceKm: Yup.number().required("Please fill distance walked (in km)").moreThan(0, 'Distance must be greater than 0'),
            caloriesBurned: Yup.number(),
            walkDate: Yup.date().required("Please select walk date"),
            walkTime: Yup.date().required("Please select walk time"),
        }),
        onSubmit: async (values: Partial<IWalkPadData>) => {
            const walkDateTime = combineDateAndTime(values.walkDate, values.walkTime);
            const addWalkPadDataBody = {
                ...values,
                walkDateTime,
                goalDurationMinutes: initialValues.goalDurationMinutes,
                goalDistanceKm: initialValues.goalDistanceKm,
                goalCaloriesBurned: initialValues.goalCaloriesBurned,
                goalStepsWalk: initialValues.goalStepsWalk,

            };
            const res = await axiosProtectedInstance.post(`/api/v1/fitness/addFitnessData`, {
                ...addWalkPadDataBody
            });
            if (res?.data) {
                showNotificationMsg("Walkpad data successfully added.");
                addWalkPadDataForm.resetForm();
                navigate("/fitness/getMyFitnessMetrics");
            }

        }
    });

    function combineDateAndTime(date: Date | null, time: Date | null) {
        if (!date || !time) return null;

        const combined = new Date(date); // clone the date
        combined.setHours(time.getHours());
        combined.setMinutes(time.getMinutes());
        combined.setSeconds(0);
        combined.setMilliseconds(0);

        return combined;
    }


    const renderAddWalkPadData = () => {
        return <>
            <Header />
            <form style={{ maxWidth: "1180px", marginLeft: "auto", marginRight: "auto", marginBottom: "60px" }} onSubmit={addWalkPadDataForm.handleSubmit}>
                <Box className="fCenter fCol my-2 mx-2">
                    <Typography variant='h6' className="section-head my-2 font-20">
                        Add Activity Data
                    </Typography>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Walk Date *"
                            value={addWalkPadDataForm.values.walkDate}
                            onChange={(value) => addWalkPadDataForm.setFieldValue('walkDate', value)}
                            maxDate={new Date()}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: "medium",
                                    margin: 'none',
                                    color: 'secondary',
                                    name: 'walkDate',
                                    onBlur: addWalkPadDataForm.handleBlur,
                                    // helperText: addWalkPadDataForm.errors.walkDate,
                                    error: addWalkPadDataForm.touched.walkDate && Boolean(addWalkPadDataForm.errors.walkDate),
                                },
                            }}

                        />

                        <TimePicker
                            label="Walk Time *"
                            value={addWalkPadDataForm.values.walkTime}
                            onChange={(value) => addWalkPadDataForm.setFieldValue('walkTime', value)}
                            ampm={false}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    size: 'medium',
                                    margin: 'none',
                                    color: 'secondary',
                                    name: 'walkTime',
                                    onBlur: addWalkPadDataForm.handleBlur,
                                    // helperText: {addWalkPadDataForm.errors.walkTime},
                                    error: addWalkPadDataForm.touched.walkTime && Boolean(addWalkPadDataForm.errors.walkTime),
                                },
                            }}
                        />
                    </LocalizationProvider>

                    <TextField
                        color="secondary"
                        label="Duration in minutes"
                        required
                        fullWidth
                        size="medium"
                        name="durationMinutes"
                        onChange={addWalkPadDataForm.handleChange}
                        onBlur={addWalkPadDataForm.handleBlur}
                        helperText={addWalkPadDataForm.errors.durationMinutes}
                        error={(addWalkPadDataForm.touched.durationMinutes && addWalkPadDataForm.errors.durationMinutes && true) || false}
                        value={addWalkPadDataForm.values.durationMinutes}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AccessTimeRoundedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        color="secondary"
                        label="Distance in Km"
                        required
                        fullWidth
                        size="medium"
                        name="distanceKm"
                        onChange={addWalkPadDataForm.handleChange}
                        onBlur={addWalkPadDataForm.handleBlur}
                        helperText={addWalkPadDataForm.errors.distanceKm}
                        error={(addWalkPadDataForm.touched.distanceKm && addWalkPadDataForm.errors.distanceKm && true) || false}
                        value={addWalkPadDataForm.values.distanceKm}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <StraightenOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <TextField
                        color="secondary"
                        label="Calories burned"
                        fullWidth
                        size="medium"
                        name="caloriesBurned"
                        onChange={addWalkPadDataForm.handleChange}
                        onBlur={addWalkPadDataForm.handleBlur}
                        helperText={addWalkPadDataForm.errors.caloriesBurned}
                        error={(addWalkPadDataForm.touched.caloriesBurned && addWalkPadDataForm.errors.caloriesBurned && true) || false}
                        value={addWalkPadDataForm.values.caloriesBurned}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalFireDepartmentOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <TextField
                        color="secondary"
                        label="Note"
                        fullWidth
                        size="medium"
                        name="note"
                        onChange={addWalkPadDataForm.handleChange}
                        onBlur={addWalkPadDataForm.handleBlur}
                        helperText={addWalkPadDataForm.errors.note}
                        error={(addWalkPadDataForm.touched.note && addWalkPadDataForm.errors.note && true) || false}
                        value={addWalkPadDataForm.values.note}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <EditNoteRoundedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button color="secondary" type="submit" disabled={!(addWalkPadDataForm.dirty && addWalkPadDataForm.isValid)} variant="contained" size="medium">Add Walkpad Data</Button>
                    <Button color="primary" variant="text" size="small" onClick={() => { navigate('/fitness/getMyFitnessMetrics') }}>View My Progress</Button>
                    <Button color="primary" variant="text" size="small" onClick={() => { navigate('/fitness/addGoalsData') }}>Update Goals</Button>
                    <Divider />
                </Box>
            </form >
        </>
    }

    return (
        <>
            {renderAddWalkPadData()}
        </>

    )
}



export default AddWalkPadData;