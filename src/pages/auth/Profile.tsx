import { useState } from "react";
import { deleteEmptyProps, useUploadImage } from "../../utils";
import { ConfirmDelete, Loader } from "../../components";
import { Navigate, useNavigate } from "react-router-dom";
import { routes } from "../../routing";
import { avatarPlaceholder } from "../../assets/images";
import {
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../features/users.api";
import { toast } from "react-toastify";
import { useMeQuery, useVerifyEmailMutation } from "../../features/auth.api";
import { resetAuth } from "../../app/api";
import { IUserWithToken } from "../../types/auth.types";

const Profile = () => {
  const navigate = useNavigate();
  const { data: userData, isFetching } = useMeQuery();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [url, isUploading] = useUploadImage(uploadedImage);
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [verifyMyEmail] = useVerifyEmailMutation();

  if (isFetching) return <Loader />;

  if (!isFetching && !userData) {
    return <Navigate to={routes.Login.absolute} />;
  }

  if (!userData) {
    return <Loader />;
  }

  async function handleUserUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    const body = deleteEmptyProps({ name, email, avatar: url });

    await updateUser({
      id: (userData as IUserWithToken).user.id,
      body,
    })
      .unwrap()
      .then((payload) => {
        toast.success("Profile was changed successfully");
        const rememberMe = localStorage.getItem("rememberMe");
        if (rememberMe === "true") {
          localStorage.setItem("user", JSON.stringify(payload));
        } else {
          sessionStorage.setItem("user", JSON.stringify(payload));
        }
      });
  }

  async function verifyEmail() {
    const token = localStorage.getItem("token");
    if (token) {
      await verifyMyEmail(token)
        .unwrap()
        .then(() => {
          toast.success("Please check your email");
        });
    } else {
      toast.error("Please login first");
    }
  }

  async function handleDeleteUser() {
    if (userData) {
      await deleteUser({ id: userData.user.id })
        .unwrap()
        .then(() => {
          navigate(routes.Login.absolute);
          resetAuth();
          toast.success("Account deleted successfully");
        });
    }
  }

  console.log(userData);

  return (
    <div className="flex flex-col gap-12">
      <div className="bg-secondary w-full h-48 rounded-lg"></div>
      <form className="form-control gap-12" onSubmit={handleUserUpdate}>
        <div className="flex justify-center">
          <label
            htmlFor="avatar"
            className="block relative mt-[-7.5rem] z-0 w-36 h-36 rounded-full cursor-pointer"
          >
            <input
              id="avatar"
              type="file"
              name="avatar"
              className="absolute top-0 left-0 h-full w-full opacity-0 cursor-pointer"
              onChange={(e) => {
                if (e.target.files) {
                  setUploadedImage(e.target.files[0]);
                }
              }}
            />
            <div className="avatar absolute inset-0 z-10">
              {isUploading ? (
                <div className="w-36 h-36 rounded-full flex justify-center items-center bg-light text-black">
                  <span className="loading loading-ring loading-lg relative left-14 top-12"></span>
                </div>
              ) : url ? (
                <div className="w-36 rounded-full">
                  <img src={url} />
                </div>
              ) : (
                <div className="w-36 rounded-full">
                  <img src={userData.user.avatar ?? avatarPlaceholder} />
                </div>
              )}
            </div>
          </label>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <input
            type="text"
            defaultValue={userData.user.name}
            placeholder="Name"
            className="input border border-black rounded-sm w-full bg-white"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            defaultValue={userData.user.email}
            placeholder="Email"
            className="input border border-black rounded-sm w-full bg-white"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <button
            type="submit"
            className="btn btn-secondary text-white hover:bg-primary hover:text-secondary hover:border-0 font-normal py-2 px-5 rounded-sm"
          >
            Save
          </button>
          {!userData.user.isEmailVerified && (
            <button
              type="button"
              className="btn btn-secondary text-white hover:bg-primary hover:text-secondary hover:border-0 font-normal py-2 px-5 rounded-sm"
              onClick={verifyEmail}
            >
              Verify Email
            </button>
          )}
          <button
            type="button"
            onClick={() =>
              (
                document.getElementById("delete-modal") as HTMLDialogElement
              ).showModal()
            }
            className="text-white bg-red-800 hover:bg-primary hover:text-secondary hover:border-0 py-2 px-5 rounded-sm"
          >
            Delete
          </button>
        </div>
      </form>
      <ConfirmDelete name="your account" handleDelete={handleDeleteUser} />
    </div>
  );
};

export default Profile;
