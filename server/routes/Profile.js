const express = require('express');
const router = express.Router();

const { auth, isStudent, isInstructor } = require('../middlewares/auth');
const {
    updateProfile,
    deleteAccount,
    updateProfilePicture,
    getAllUserDetails,
    getEnrolledCourses,
    instructorDashboard
} = require('../controllers/Profile');

router.delete('/deleteProfile', auth, deleteAccount);
router.put('/updateProfile', auth, updateProfile);
router.put('/updateProfilePicture', auth, updateProfilePicture);
router.get('/getEnrolledCourses', auth, getEnrolledCourses);
router.get('/instructorDashboard', auth, isInstructor, instructorDashboard);
router.get('/getUserDetails', auth, isStudent, getAllUserDetails);

module.exports = router;