import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import {
    Box,
    FormControl,
    InputAdornment,
    MenuItem,
    Select,
} from '@mui/material';

export enum SearchType {
    MindName = 'mindName',
    PlayerName = 'creatorName',
}
export function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<SearchType>(
        SearchType.MindName
    );

    const handleSearchTerm = (e) => {
        const newSearch = e.target.value;
        console.log(newSearch);
        setSearchTerm(newSearch);
        onSearch(searchType, newSearch);
    };

    const handleSearchTypeSelect = (e) => {
        const newSearchType = e.target.value;
        setSearchType(newSearchType);
        onSearch(newSearchType, searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        onSearch(searchType, '');
    };

    return (
        <Box
            display={'flex'}
            width={'100%'}
            m={'12px'}
            justifyContent={'center'}
        >
            <FormControl
                variant="outlined"
                style={{ width: '30%', backgroundColor: 'white' }}
            >
                <Select
                    value={searchType}
                    onChange={handleSearchTypeSelect}
                    label="Search Type"
                    defaultValue={SearchType.MindName}
                >
                    <MenuItem value={SearchType.MindName}>Mind Name</MenuItem>
                    <MenuItem value={SearchType.PlayerName}>Creator</MenuItem>
                </Select>
            </FormControl>
            <input
                autoFocus
                style={{
                    width: '50%',
                    backgroundColor: 'white',
                    borderWidth: '1px',
                    borderColor: 'lightgrey',
                    borderRadius: '5px',
                }}
                type="text"
                placeholder={`Search by ${
                    searchType === SearchType.MindName ? 'Mind Name' : 'Creator'
                }`}
                value={searchTerm}
                onChange={handleSearchTerm}
            />
            <Button
                variant="contained"
                color="primary"
                onClick={handleClearSearch}
            >
                Clear
            </Button>
        </Box>
    );
}
