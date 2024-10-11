import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { TbLayoutSidebarLeftCollapseFilled, TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";

export default function VideoDetailsSidebar({ setReviewModal }) {
    const [activeStatus, setActiveStatus] = useState("");
    const [videoBarActive, setVideoBarActive] = useState("");
    const [collapse, setCollapse] = useState(true);

    const navigate = useNavigate();
    const location = useLocation();
    const { sectionId, subSectionId } = useParams();
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state?.viewCourse);

    useEffect(() => {
        (() => {
            if (!courseSectionData?.length)
                return;
            const currentSectionIndx = courseSectionData.findIndex(
                (data) => data?._id === sectionId
            );
            const currentSubSectionIndx = courseSectionData?.[
                currentSectionIndx
            ]?.subSection.findIndex((data) => data?._id === subSectionId);
            const activeSubSectionId =
                courseSectionData[currentSectionIndx]?.subSection?.[
                    currentSubSectionIndx
                ]?._id;
            setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
            setVideoBarActive(activeSubSectionId);
        })();
    }, [courseSectionData, courseEntireData, location.pathname]);

    const collapseHandler = () => {
        setCollapse((prev) => !prev);
    }

    return (
        <>
            <div className={`flex flex-col h-[calc(100vh-3.5rem)] ${collapse ? "w-[60px]" : "w-[300px] max-w-[350px] border-r-richblack-700 bg-richblack-800 border-r-[1px]"}`}>
                <div className={`relative p-4 mb-2 flex flex-row justify-between ${collapse ? "justify-center" : "gap-10"} items-center text-yellow-100`}>
                    <p className="text-3xl text-yellow-100">
                        {
                            !collapse && "StudyNotion"
                        }
                    </p>
                    {/* <span
                        className="absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50"
                    ></span> */}
                    <button className="transition-all duration-300 text-4xl">
                        {
                            collapse ? <TbLayoutSidebarRightCollapseFilled onClick={collapseHandler} /> : <TbLayoutSidebarLeftCollapseFilled onClick={collapseHandler} />
                        }
                    </button>
                </div>

                {!collapse && (
                    <>
                        <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                            <div className="flex w-full items-center justify-between ">
                                <div
                                    onClick={() => {
                                        navigate(`/dashboard/enrolled-courses`);
                                    }}
                                    className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
                                    title="back"
                                >
                                    <IoIosArrowBack size={30} />
                                </div>
                                <IconBtn
                                    text="Add Review"
                                    customClasses="ml-auto"
                                    onclick={() => setReviewModal(true)}
                                />
                            </div>
                            <div className="flex flex-col">
                                <p>{courseEntireData?.courseName}</p>
                                <p className="text-sm font-semibold text-richblack-500">
                                    {completedLectures?.length} / {totalNoOfLectures}
                                </p>
                            </div>
                        </div>

                        <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
                            {courseSectionData?.map((section, index) => (
                                <div
                                    className="mt-2 cursor-pointer text-sm text-richblack-5"
                                    onClick={() => setActiveStatus(section?._id)}
                                    key={index}
                                >
                                    {/* Section */}
                                    <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                                        <div className="w-[70%] font-semibold">
                                            {section?.sectionName}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-[12px] font-medium">
                                                Lession {section?.subSection?.length}
                                            </span>
                                            <span
                                                className={`${activeStatus === section?.sectionName
                                                    ? "rotate-0"
                                                    : "rotate-180"
                                                    } transition-all duration-500`}
                                            >
                                                <BsChevronDown />
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sub Sections */}
                                    {activeStatus === section?._id && (
                                        <div className="transition-[height] duration-500 ease-in-out">
                                            {section?.subSection?.map((topic, i) => (
                                                <div
                                                    className={`flex gap-3  px-5 py-2 ${videoBarActive === topic._id
                                                        ? "bg-yellow-100 font-semibold text-richblack-800"
                                                        : "hover:bg-richblack-900"
                                                        } `}
                                                    key={i}
                                                    onClick={() => {
                                                        navigate(
                                                            `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                                                        );
                                                        setVideoBarActive(topic._id);
                                                    }}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={completedLectures.includes(topic?._id)}
                                                        onChange={() => { }}
                                                    />
                                                    {topic.title}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div >
        </>
    );
}