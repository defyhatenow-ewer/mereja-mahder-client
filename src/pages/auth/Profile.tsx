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
import { resetAuth } from "../../app/api";
import useCurrentUser from "../../hooks/useCurrentUser";
import { IUserWithToken } from "../../types/auth.types";
import { config } from "../../config";
import { Save, Trash } from "../../components/Icons";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, isFetching] = useCurrentUser();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [url, isUploading] = useUploadImage(uploadedImage);
  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  if (isFetching) return <Loader />;

  if (!isFetching && !user) {
    return <Navigate to={routes.Login.absolute} />;
  }

  if (!user) {
    return <Loader />;
  }

  async function handleUserUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();

    const body = deleteEmptyProps({ name, email });

    await updateUser({ id: (user as IUserWithToken).user.id, body })
      .unwrap()
      .then(() => {
        toast.success(t("profileUpdated"));
      });
  }

  async function handleDeleteUser() {
    if (user) {
      await deleteUser({ id: user.user.id })
        .unwrap()
        .then(() => {
          navigate(routes.Login.absolute);
          resetAuth();
          toast.success(t("accountDeleted"));
        });
    }
  }

  return (
    <div className="flex flex-col gap-5 md:gap-10">
      <div className="bg-secondary w-full h-48 rounded-lg"></div>
      <form
        className="flex flex-col gap-5 md:gap-10"
        onSubmit={handleUserUpdate}
      >
        <div className="flex justify-center">
          <label
            htmlFor="avatar"
            className="block relative mt-[-7.5rem] z-0 w-36 h-36 rounded-full"
          >
            <input
              id="avatar"
              type="file"
              name="avatar"
              className="absolute top-0 left-0 h-full w-full opacity-0"
              onChange={(e) => {
                if (e.target.files) {
                  setUploadedImage(e.target.files[0]);
                }
              }}
              disabled
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
                  <img
                    src={
                      user.user.avatar
                        ? `${config.env.apiKey}${user.user.avatar.thumbnailURL}`
                        : avatarPlaceholder
                    }
                  />
                </div>
              )}
            </div>
          </label>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <input
            type="text"
            defaultValue={user.user.name}
            placeholder="Name"
            className="input border border-black rounded-sm w-full bg-white"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            defaultValue={user.user.email}
            placeholder="Email"
            className="input border border-black rounded-sm w-full bg-white"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <button
            type="submit"
            aria-disabled={isUpdatingUser}
            className="flex justify-between items-center gap-3 bg-secondary hover:bg-primary text-primary hover:text-secondary cursor-pointer rounded-4xl p-2 ps-4 w-full md:max-w-[10rem] md:ps-6"
          >
            <span>{t("save")}</span>
            {isUpdatingUser ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
                <Save />
              </div>
            )}
          </button>
          <button
            type="button"
            onClick={() =>
              (
                document.getElementById("delete-modal") as HTMLDialogElement
              ).showModal()
            }
            className="flex justify-between items-center gap-3 bg-red-800 hover:bg-primary text-primary hover:text-secondary cursor-pointer rounded-4xl p-2 ps-4 w-full md:max-w-[10rem] md:ps-6"
          >
            {t("delete")}
            {isDeletingUser ? (
              <span className="loading loading-spinner loading-md"></span>
            ) : (
              <div className="flex justify-center items-center rounded-full p-1 bg-primary text-secondary child-icon">
                <Trash />
              </div>
            )}
          </button>
        </div>
      </form>
      <ConfirmDelete name={t("yourAccount")} handleDelete={handleDeleteUser} />
    </div>
  );
};

export default Profile;
