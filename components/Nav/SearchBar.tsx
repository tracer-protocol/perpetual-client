import React from 'react';

import { SearchOutlined } from '@ant-design/icons';
interface SBProps {
    filter: string;
    setFilter: (filter: string) => void;
    cClasses?: string;
}

export const SearchBar: React.FC<SBProps> = ({ filter, setFilter, cClasses }: SBProps) => {
    return (
        <div className={`relative text-black border-2 border-gray-100 rounded-full flex ${cClasses}`}>
            <SearchOutlined className="h-4 mt-auto mb-auto ml-3 inline-block" color="#0000bd" />
            <input
                type="search"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                name="serch"
                placeholder="Filter table"
                className="w-full px-5 rounded-full text-sm focus:outline-none bg-transparent"
            />
        </div>
    );
};
