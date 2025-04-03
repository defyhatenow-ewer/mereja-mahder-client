import { Link, useNavigate } from "react-router-dom";
import { routes } from "../routing";
import { avatarPlaceholder } from "../assets/images";
import { useLogoutMutation } from "../features/auth.api";
import { resetAuth } from "../app/api";
import { useState } from "react";
import useCachedUser from "../hooks/useCachedUser";

const LogoutButton = () => {
  const navigate = useNavigate();
  const { user } = useCachedUser();
  const [logoutUser] = useLogoutMutation();

  const [open, setOpen] = useState(false);

  const formatName = (name: string): string => {
    const [firstName, secondName] = name.split(" ");
    return `${firstName.charAt(0).toUpperCase() + firstName.slice(1)} ${
      secondName ? secondName[0].toUpperCase() + "." : ""
    }`;
  };

  async function logout() {
    await logoutUser().then(() => {
      navigate(routes.Login.absolute);
      resetAuth();
    });
  }

  if (!user)
    return (
      <Link
        to={routes.Login.absolute}
        className="bg-black py-4 px-10 text-primary hover:bg-tertiary"
      >
        Login
      </Link>
    );

  return (
    <div className="p-3 bg-black text-primary hover:bg-tertiary flex justify-between items-end gap-6 md:gap-8">
      <div className="flex items-end gap-3">
        <div className="avatar">
          <div className="w-8 rounded-full">
            <img src={user.avatar ?? avatarPlaceholder} />
          </div>
        </div>
        <p className="text-white">{formatName(user.name)}</p>
      </div>
      <details
        className="dropdown  dropdown-end"
        onToggle={(e) => {
          if (e.currentTarget.open) {
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
      >
        <summary className="list-none">
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 cursor-pointer text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 15.75 7.5-7.5 7.5 7.5"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 cursor-pointer text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          )}
        </summary>
        <ul className="p-2 shadow menu dropdown-content z-[1] rounded-sm bg-black text-white hover:bg-tertiary">
          <li>
            <Link to={routes.Profile.absolute}>Profile</Link>
          </li>
          <li>
            <a onClick={logout}>Logout</a>
          </li>
        </ul>
      </details>
    </div>
  );
};

export default LogoutButton;
