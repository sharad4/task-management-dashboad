import React, { useCallback } from 'react';
import { Search, Filter } from 'lucide-react';
import { TaskStatus, SortBy } from '../../types'

const TaskFilters = ({ filter, sortBy, searchTerm, onFilterChange, onSortChange, onSearchChange, isPending = false })