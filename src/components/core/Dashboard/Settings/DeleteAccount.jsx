import { FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteProfile } from "../../../../services/operations/SettingsAPI";
import ConfirmationModal from "../../../common/ConfirmationModal";
import { useState } from "react";

export default function DeleteAccount() {
    const { token } = useSelector((state) => state?.auth);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleDeleteAccount() {
        try {
            dispatch(deleteProfile(token, navigate));
        } catch (error) {
            // console.log("ERROR MESSAGE - ", error.message);
        }
    }

    return (
        <>
            <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
                <div className="flex aspect-square h-14 w-14 items-center justify-center rounded-full bg-pink-700">
                    <FiTrash2 className="text-3xl text-pink-200" />
                </div>
                <div className="flex flex-col gap-4 space-y-2">
                    <div>
                        <h2 className="text-lg font-semibold text-richblack-5">
                            Delete Account
                        </h2>
                        <div className="w-3/5 text-pink-25">
                            <p>Would you like to delete account?</p>
                            <p>
                                This account may contain Paid Courses. Deleting your account is
                                permanent and will remove all the contain associated with it.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="w-fit cursor-pointer italic text-pink-300 text-xl px-4 py-3 border-2 rounded-md"
                        onClick={() =>
                            setConfirmationModal({
                                text1: "Are you sure?",
                                text2: "Your account will be deleted. This account may contain Paid Courses.",
                                btn1Text: "Delete",
                                btn2Text: "Cancel",
                                btn1Handler: () => dispatch(handleDeleteAccount),
                                btn2Handler: () => setConfirmationModal(null),
                            })
                        }
                    >
                        I want to delete my account.
                    </button>
                </div>
            </div>
            {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
        </>
    );
}