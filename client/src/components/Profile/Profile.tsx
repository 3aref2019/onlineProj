//React
import React from "react";

//Redux
import { useDispatch, useSelector } from "react-redux";

//Antd
import { Button, Spin, Tag } from "antd";

//Types
import { State } from "../../redux/types";

//Actions
import {
  handleBioModalClose,
  handleBioModalOpen,
  handleUpdateEmailModalClose,
  handleUpdateEmailModalOpen,
  handleUpdatePasswordModalClose,
  handleUpdatePasswordModalOpen,
  updateBio,
  updateEmail,
  updatePassword,
} from "../../redux/slices/profileSlice";
import {
  createActivationLink,
  logoutActionThunk,
} from "../../redux/slices/authSlice";

//Components
import ProfilePictureUpload from "./ProfilePictureUpload";
import ProfileEditBio from "./ProfileEditBio";
import ProfileEditEmail from "./ProfileEditEmail";
import ProfileEditPassword from "./ProfileEditPassword";

function Profile() {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state: State) => state.auth);
  const { emailModal, passwordModal, bioModal, errors, updating } = useSelector(
    (state: State) => state.profile
  );

  return (
    <>
      {loading ? (
        <Spin size="large" spinning />
      ) : (
        <div
          className="container flex flex-col items-center max-w-md mt-10 space-y-6 shadow-2xl "
          id="profile"
        >
          <div className="max-w-xs my-3 rounded rounded-t-lg ">
            <ProfilePictureUpload imageUrn={user.imageUrn} />
            <div className="px-3 pt-2 pb-6 text-center">
              <h3 className="font-sans text-sm text-black break-words bold">
                {user.username}
                {user.emailConfirmed && (
                  <i className="text-green-500 fas fa-check"></i>
                )}
              </h3>

              <p className="mt-2 font-sans font-light text-grey-dark">
                <p>
                  {!user.emailConfirmed && (
                    <Button
                      type="link"
                      onClick={() => dispatch(createActivationLink())}
                    >
                      Activate your email
                    </Button>
                  )}
                </p>
              </p>
              <p className="max-w-sm mt-2 mb-2 font-sans break-words text-grey-dark">
                {user.bio}
              </p>
              <Tag color="blue">{user.role}</Tag>
            </div>

            <div className="flex flex-col items-center justify-center pb-3 space-x-2 text-grey-dark md:flex">
              <Button
                className="w-full m-2"
                onClick={() => dispatch(handleBioModalOpen())}
              >
                Edit bio
              </Button>
              <Button
                className="w-full m-2"
                onClick={() => dispatch(handleUpdateEmailModalOpen())}
              >
                Edit email
              </Button>
              <Button
                className="w-full m-2"
                onClick={() => dispatch(handleUpdatePasswordModalOpen())}
              >
                Edit password
              </Button>
              <Button
                className="w-full m-2"
                onClick={() => dispatch(logoutActionThunk())}
                danger
              >
                Log out
              </Button>
            </div>
          </div>
          <ProfileEditEmail
            handleOk={() => dispatch(updateEmail())}
            handleCancel={() => dispatch(handleUpdateEmailModalClose())}
            isModalVisible={emailModal}
            errors={errors}
            updating={updating}
          />
          <ProfileEditPassword
            handleOk={() => dispatch(updatePassword())}
            handleCancel={() => dispatch(handleUpdatePasswordModalClose())}
            isModalVisible={passwordModal}
            errors={errors}
            updating={updating}
          />
          <ProfileEditBio
            handleOk={() => dispatch(updateBio())}
            handleCancel={() => dispatch(handleBioModalClose())}
            isModalVisible={bioModal}
            errors={errors}
            updating={updating}
            bio={user.bio}
          />
        </div>
      )}
    </>
  );
}

export default Profile;
//src="https://cdn3.f-cdn.com/contestentries/1376995/30494909/5b566bc71d308_thumb900.jpg"
