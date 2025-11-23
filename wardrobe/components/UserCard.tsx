import React from 'react';
import { IGProfile } from '../types';
import { BadgeCheck, UserMinus, UserPlus } from 'lucide-react';

interface UserCardProps {
  profile: IGProfile;
  type: 'followed' | 'unfollowed';
}

export const UserCard: React.FC<UserCardProps> = ({ profile, type }) => {
  const isFollowed = type === 'followed';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 mb-3">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <img 
            src={profile.avatarUrl} 
            alt={profile.username} 
            className="w-12 h-12 rounded-full object-cover border border-gray-200"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white ${isFollowed ? 'bg-green-500' : 'bg-red-500'}`}>
            {isFollowed ? <UserPlus size={12} className="text-white" /> : <UserMinus size={12} className="text-white" />}
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <span className="font-semibold text-gray-900 text-sm">{profile.username}</span>
            {profile.isVerified && <BadgeCheck size={14} className="text-blue-500 fill-blue-50" />}
          </div>
          <span className="text-xs text-gray-500">{profile.fullName}</span>
          {profile.category && <span className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{profile.category}</span>}
        </div>
      </div>

      <button className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
        isFollowed 
          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
          : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}>
        {isFollowed ? 'View' : 'Follow'}
      </button>
    </div>
  );
};