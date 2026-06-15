import React from 'react';

export const LoadingSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse">
      <div className="h-32 bg-gray-200 rounded-xl mb-4"></div>
      <div className="h-20 bg-gray-200 rounded-xl mb-3"></div>
      <div className="h-20 bg-gray-200 rounded-xl mb-3"></div>
      <div className="h-20 bg-gray-200 rounded-xl"></div>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow p-4">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  );
};

export const TransactionSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex justify-between p-4 border-b">
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="h-4 bg-gray-200 rounded w-20"></div>
    </div>
  );
};