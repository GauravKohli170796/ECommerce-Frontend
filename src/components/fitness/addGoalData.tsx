import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import LocalFireDepartmentOutlinedIcon from '@mui/icons-material/LocalFireDepartmentOutlined';
import StraightenOutlinedIcon from '@mui/icons-material/StraightenOutlined';
import { Button, Divider, InputAdornment, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { IGoalData } from '../../models/productModel';
import { useFormik } from 'formik';
import { axiosProtectedInstance } from '../../services/axiosInstance';
import { showNotificationMsg } from '../../services/createNotification';
import { AppConst, notificationType } from '../../constants/AppConst';
import Header from '../header/Header';


function AddGoalsData() {
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

    const addGoalDataForm = useFormik<Partial<IGoalData>>({
        enableReinitialize: true,
        initialValues: initialValues,
        validationSchema: Yup.object({
            goalDurationMinutes: Yup.number().required("Please fill your goal duration (in min)").moreThan(0, 'Duration must be greater than 0'),
            goalDistanceKm: Yup.number().required("Please fill your goal distance (in km)").moreThan(0, 'Distance must be greater than 0'),
            goalCaloriesBurned: Yup.number().required("Please fill your goal calories (in kcal)").moreThan(0, 'Calories must be greater than 0'),
            goalStepsWalk: Yup.number().required("Please fill your goal steps in count").moreThan(0, 'Steps must be greater than 0'),
        }),
        onSubmit: async (values: Partial<IGoalData>) => {
            const addGoalDataBody = { ...values };
            const res = await axiosProtectedInstance.put(`/api/v1/fitness/addFitnessGoalsData`, {
                ...addGoalDataBody
            });
            if (res?.data) {
                showNotificationMsg("Goals data successfully added.");
                addGoalDataForm.resetForm();
                navigate("/fitness/getMyFitnessMetrics");
            }
        }
    });


    const renderAddGoalsData = () => {
        return <>
            <Header />
            <form style={{ maxWidth: "1180px", marginLeft: "auto", marginRight: "auto", marginBottom: "60px" }} onSubmit={addGoalDataForm.handleSubmit}>
                <Box className="fCenter fCol my-2 mx-2">
                    <Typography variant='h6' className="section-head my-2 font-20">
                        Add Goal Data
                    </Typography>
                    <TextField
                        color="secondary"
                        label="Goal Duration in min"
                        required
                        fullWidth
                        size="medium"
                        name="goalDurationMinutes"
                        onChange={addGoalDataForm.handleChange}
                        onBlur={addGoalDataForm.handleBlur}
                        helperText={addGoalDataForm.errors.goalDurationMinutes}
                        error={(addGoalDataForm.touched.goalDurationMinutes && addGoalDataForm.errors.goalDurationMinutes && true) || false}
                        value={addGoalDataForm.values.goalDurationMinutes}
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
                        label="Goal Distance in Km"
                        required
                        fullWidth
                        size="medium"
                        name="goalDistanceKm"
                        onChange={addGoalDataForm.handleChange}
                        onBlur={addGoalDataForm.handleBlur}
                        helperText={addGoalDataForm.errors.goalDistanceKm}
                        error={(addGoalDataForm.touched.goalDistanceKm && addGoalDataForm.errors.goalDistanceKm && true) || false}
                        value={addGoalDataForm.values.goalDistanceKm}
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
                        label="Goal Calories burned"
                        fullWidth
                        size="medium"
                        name="goalCaloriesBurned"
                        onChange={addGoalDataForm.handleChange}
                        onBlur={addGoalDataForm.handleBlur}
                        helperText={addGoalDataForm.errors.goalCaloriesBurned}
                        error={(addGoalDataForm.touched.goalCaloriesBurned && addGoalDataForm.errors.goalCaloriesBurned && true) || false}
                        value={addGoalDataForm.values.goalCaloriesBurned}
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
                        label="Goal Steps"
                        fullWidth
                        size="medium"
                        name="goalStepsWalk"
                        onChange={addGoalDataForm.handleChange}
                        onBlur={addGoalDataForm.handleBlur}
                        helperText={addGoalDataForm.errors.goalStepsWalk}
                        error={(addGoalDataForm.touched.goalStepsWalk && addGoalDataForm.errors.goalStepsWalk && true) || false}
                        value={addGoalDataForm.values.goalStepsWalk}
                        type="number"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <LocalFireDepartmentOutlinedIcon />
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button color="secondary" type="submit" disabled={!(addGoalDataForm.dirty && addGoalDataForm.isValid)} variant="contained" size="medium">Add Goals Data</Button>
                    <Button color="primary" variant="text" size="small" onClick={() => { navigate('/fitness/getMyFitnessMetrics') }}>View My Progress</Button>
                    <Divider />
                </Box>
            </form >
        </>
    }

    return (
        <>
            {renderAddGoalsData()}
        </>

    )
}



export default AddGoalsData;