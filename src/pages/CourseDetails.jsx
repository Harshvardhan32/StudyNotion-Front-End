import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast';
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import Markdown from 'react-markdown';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../components/common/ConfirmationModal";
import Footer from "../components/common/Footer";
import RatingStars from "../components/common/RatingStars";
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar";
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard";
import { formatDate } from "../services/formatDate";
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI";
import { buyCourse } from "../services/operations/studentFeaturesAPI";
import { ACCOUNT_TYPE } from "../utils/constants";
import { addToCart } from "../slices/cartSlice";
import GetAvgRating from "../utils/avgRating";
import Error from "./Error";

function CourseDetails() {
    const { user } = useSelector((state) => state?.profile);
    const { token } = useSelector((state) => state?.auth);
    const { loading } = useSelector((state) => state?.profile);
    const { paymentLoading } = useSelector((state) => state?.course);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { courseId } = useParams();

    // Declear a state to save the course details
    const [courseData, setCourseData] = useState(null);
    const [confirmationModal, setConfirmationModal] = useState(null);
    useEffect(() => {
        (async () => {
            try {
                const result = await fetchCourseDetails(courseId);
                setCourseData(result);
                // console.log('Course details result : ', result);
            } catch (error) {
                // console.log("Could not fetch Course Details");
            }
        })();
    }, [courseId]);

    // Calculating Avg Review count
    const [avgReviewCount, setAvgReviewCount] = useState(0);
    useEffect(() => {
        const count = GetAvgRating(courseData?.data?.courseDetails?.ratingAndReviews);
        setAvgReviewCount(count);
    }, [courseData]);

    // Collapse all
    const [isActive, setIsActive] = useState(Array(0));
    const handleActive = (id) => {
        setIsActive(
            !isActive.includes(id)
                ? isActive.concat([id])
                : isActive.filter((e) => e !== id)
        );
    };

    // Total number of lectures
    const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
    useEffect(() => {
        let lectures = 0;
        courseData?.data?.courseDetails?.courseContent?.forEach((section) => {
            lectures += section?.subSection?.length || 0;
        });
        setTotalNoOfLectures(lectures);
    }, [courseData]);

    if (loading || !courseData) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div role="status">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin fill-richblack-25" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only text-white">Loading...</span>
                </div>
            </div>
        );
    }

    if (!courseData?.success) {
        return <Error />;
    }

    const {
        _id: _id,
        courseName,
        courseDescription,
        thumbnail,
        price,
        whatYouWillLearn,
        courseContent,
        ratingAndReviews,
        instructor,
        studentsEnrolled,
        createdAt,
    } = courseData?.data?.courseDetails;

    const handleBuyCourse = () => {
        if (token) {
            if (user?.accountType === ACCOUNT_TYPE?.INSTRUCTOR ||
                user?.accountType === ACCOUNT_TYPE?.ADMIN) {
                toast.error(`You are an ${user?.accountType}. You can't buy course.`);
            } else {
                buyCourse(token, [courseId], user, navigate, dispatch);
            }
            return;
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to Purchase Course.",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        });
    };

    const handleAddToCart = () => {
        if (user && user?.accountType === ACCOUNT_TYPE?.INSTRUCTOR) {
            toast.error("You are an Instructor. You can't buy a course.");
            return;
        }
        if (token) {
            dispatch(addToCart(courseData?.data?.courseDetails));
            return;
        }
        setConfirmationModal({
            text1: "You are not logged in!",
            text2: "Please login to add To Cart",
            btn1Text: "Login",
            btn2Text: "Cancel",
            btn1Handler: () => navigate("/login"),
            btn2Handler: () => setConfirmationModal(null),
        });
    };

    // console.log('Instructor details: ', instructor);

    if (paymentLoading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div role="status">
                    <svg aria-hidden="true" className="w-16 h-16 text-gray-200 animate-spin fill-richblack-25" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only text-white">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={`relative w-full bg-richblack-800`}>
                {/* Hero Section */}
                <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
                    <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
                        <div className="relative block max-h-[30rem] lg:hidden">
                            <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
                            <img
                                src={thumbnail}
                                alt="course thumbnail"
                                className="aspect-auto w-full"
                            />
                        </div>
                        <div className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}>
                            <div>
                                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                                    {courseName.charAt(0).toUpperCase().concat(courseName.substr(1))}
                                </p>
                            </div>
                            <p className={`text-richblack-200`}>{courseDescription}</p>
                            <div className="text-md flex flex-wrap items-center gap-2">
                                <span className="text-yellow-25">{avgReviewCount ? avgReviewCount : 0}</span>
                                <RatingStars Review_Count={avgReviewCount ? avgReviewCount : 0} Star_Size={24} />
                                <span>{`(${ratingAndReviews?.length} reviews)`}</span>
                                <span>{`${studentsEnrolled?.length} students enrolled`}</span>
                            </div>
                            <div>
                                <p>
                                    Created By {`${instructor?.firstName} ${instructor?.lastName}`}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-5 text-lg">
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <BiInfoCircle /> Created at {formatDate(createdAt)}
                                </p>
                                <p className="flex items-center gap-2">
                                    {" "}
                                    <HiOutlineGlobeAlt /> English
                                </p>
                            </div>
                        </div>
                        <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
                            <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                                Rs. {price}
                            </p>
                            <button className="bg-yellow-50 py-3 text-xl text-black rounded-lg" onClick={handleBuyCourse}>
                                Buy Now
                            </button>
                            <button className="bg-richblack-900 py-3 text-xl text-white rounded-lg" onClick={handleAddToCart}>
                                Add to Cart
                            </button>
                        </div>
                    </div>
                    {/* Courses Card */}
                    <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
                        <CourseDetailsCard
                            course={courseData?.data?.courseDetails}
                            handleBuyCourse={handleBuyCourse}
                            handleAddToCart={handleAddToCart}
                        />
                    </div>
                </div>
            </div>
            <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
                <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
                    {/* What will you learn section */}
                    <div className="my-8 border border-richblack-600 p-8">
                        <p className="text-3xl font-semibold">What you'll learn</p>
                        <div className="mt-5">
                            <Markdown>{whatYouWillLearn}</Markdown>
                        </div>
                    </div>

                    {/* Course Content Section */}
                    <div className="max-w-[830px] ">
                        <div className="flex flex-col gap-3">
                            <p className="text-[28px] font-semibold">Course Content</p>
                            <div className="flex flex-wrap justify-between gap-2">
                                <div className="flex flex-wrap gap-2">
                                    <span>
                                        {courseContent?.length} {`section(s)`}
                                    </span>
                                    <span>
                                        {totalNoOfLectures} {`lecture(s)`}
                                    </span>
                                    <span>{courseData?.data?.totalDuration} total length</span>
                                </div>
                                <div>
                                    <button
                                        className="text-yellow-25"
                                        onClick={() => setIsActive([])}
                                    >
                                        Collapse all sections
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Course Details Accordion */}
                        <div className="py-4">
                            {courseContent?.map((course, index) => (
                                <CourseAccordionBar
                                    course={course}
                                    key={index}
                                    isActive={isActive}
                                    handleActive={handleActive}
                                />
                            ))}
                        </div>

                        {/* Author Details */}
                        <div className="mb-12 py-4">
                            <p className="text-[28px] font-semibold">Author</p>
                            <div className="flex items-center gap-4 py-4">
                                <img src={
                                    instructor?.image
                                        ? instructor?.image
                                        : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor?.firstName} ${instructor?.lastName}`
                                }
                                    alt="Author"
                                    className="h-14 w-14 rounded-full object-cover"
                                />
                                <p className="text-lg">{`${instructor?.firstName} ${instructor?.lastName}`}</p>
                            </div>
                            <p className="text-richblack-50">
                                {instructor?.additionalDetails?.about}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    );
}

export default CourseDetails;