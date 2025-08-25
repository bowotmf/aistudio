
import React from 'react';

const SkeletonRow: React.FC = () => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
    </div>
);

const SkeletonSectionHeader: React.FC = () => (
    <div className="mt-6 p-2 bg-gray-100 rounded-md">
        <div className="h-5 bg-gray-300 rounded w-1/2"></div>
    </div>
);

const PreviewLoadingSkeleton: React.FC<{ themeColor: string }> = ({ themeColor }) => {
    return (
        <div id="preview-content" className="animate-pulse">
            <div className="p-8 text-center" style={{ backgroundColor: themeColor }}>
                <div className="h-7 bg-white/30 rounded w-3/4 mx-auto"></div>
                <div className="mt-2 h-4 bg-white/30 rounded w-1/2 mx-auto"></div>
            </div>
            <div className="p-8 font-serif">
                 <div className="p-2 bg-gray-100 rounded-md">
                    <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                 </div>
                 <div className="mt-3 border border-gray-200">
                    <div className="p-3 border-b border-gray-200 flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-3/5"></div></div>
                    <div className="p-3 border-b border-gray-200 flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-3/5"></div></div>
                    <div className="p-3 border-b border-gray-200 flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-3/5"></div></div>
                    <div className="p-3 border-b border-gray-200 flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-3/5"></div></div>
                    <div className="p-3 border-b border-gray-200 flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-3/5"></div></div>
                    <div className="p-3 flex justify-between"><div className="h-4 bg-gray-200 rounded w-1/4"></div><div className="h-4 bg-gray-200 rounded w-3/5"></div></div>
                 </div>


                 <SkeletonSectionHeader />
                 <SkeletonRow />
                 <SkeletonRow />
                 
                 <SkeletonSectionHeader />
                 <SkeletonRow />
                 <SkeletonRow />
                 <SkeletonRow />

                 <div className="mt-16 grid grid-cols-2 gap-8 text-center text-sm">
                    <div>
                        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                        <div className="mt-1 h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                        <div className="h-20"></div>
                        <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
                        <div className="mt-2 h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    </div>
                     <div>
                        <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                         <div className="mt-1 h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                        <div className="h-20"></div>
                        <div className="h-5 bg-gray-300 rounded w-1/2 mx-auto"></div>
                        <div className="mt-2 h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default PreviewLoadingSkeleton;