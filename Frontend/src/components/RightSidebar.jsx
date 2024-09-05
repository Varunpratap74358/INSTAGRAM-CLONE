import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const RightSidebar = () => {
  const { user, suggestedUsers } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 p-2 bg-white rounded-full shadow-md focus:outline-none lg:hidden z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-gray-800" />
        ) : (
          <Menu className="w-6 h-6 text-gray-800" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-screen bg-white shadow-lg p-4 transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 lg:w-[380px] md:w-[320px] sm:w-[280px] w-[240px]`}
      >
        <div className="space-y-6">
          {/* User Profile */}
          <div className="flex items-center gap-4">
            <Link to={`/profile/${user?._id}`}>
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={user?.profilePicture}
                  alt={`${user?.username}'s profile picture`}
                  className="rounded-full"
                />
                <AvatarFallback className="rounded-full bg-gray-200">
                  {user?.username?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex flex-col">
              <Link
                to={`/profile/${user?._id}`}
                className="text-lg font-semibold"
              >
                {user?.username}
              </Link>
              <span className="text-gray-500 text-sm">
                {user?.bio || 'Bio here...'}
              </span>
            </div>
          </div>

          {/* Suggested Users */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Suggested for You
            </h2>
            {suggestedUsers && suggestedUsers.map((v, i) => (
              <div key={i} className="flex items-center justify-between">
                <Link
                  to={`/profile/${v._id}`}
                  className="flex items-center gap-3"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={v?.profilePicture}
                      alt={`${v?.username}'s profile picture`}
                      className="rounded-full"
                    />
                    <AvatarFallback className="rounded-full bg-gray-200">
                      {v?.username?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-gray-800">
                    {v?.username}
                  </span>
                </Link>
                <button className="text-blue-600 font-semibold hover:text-blue-400">
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
