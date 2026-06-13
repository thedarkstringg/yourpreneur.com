// Pagination utilities for loading data in batches

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export const calculatePagination = (total: number, pageSize: number, page: number): PaginationState => {
  return {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
};

export const getPaginatedItems = <T>(items: T[], page: number, pageSize: number): T[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return items.slice(start, end);
};

export const nextPage = (state: PaginationState): PaginationState => {
  if (state.page >= state.totalPages) return state;
  return { ...state, page: state.page + 1 };
};

export const prevPage = (state: PaginationState): PaginationState => {
  if (state.page <= 1) return state;
  return { ...state, page: state.page - 1 };
};

export const goToPage = (state: PaginationState, page: number): PaginationState => {
  const validPage = Math.max(1, Math.min(page, state.totalPages));
  return { ...state, page: validPage };
};

export const hasNextPage = (state: PaginationState): boolean => {
  return state.page < state.totalPages;
};

export const hasPrevPage = (state: PaginationState): boolean => {
  return state.page > 1;
};

// Infinite scroll utilities
export interface InfiniteScrollState {
  items: any[];
  isLoading: boolean;
  hasMore: boolean;
  cursor?: string;
}

export const initializeInfiniteScroll = (): InfiniteScrollState => {
  return {
    items: [],
    isLoading: false,
    hasMore: true,
  };
};

export const appendItems = (state: InfiniteScrollState, newItems: any[], cursor?: string): InfiniteScrollState => {
  return {
    ...state,
    items: [...state.items, ...newItems],
    cursor,
    hasMore: newItems.length > 0,
    isLoading: false,
  };
};

export const resetScroll = (state: InfiniteScrollState): InfiniteScrollState => {
  return {
    ...state,
    items: [],
    cursor: undefined,
    hasMore: true,
    isLoading: false,
  };
};

export const setLoading = (state: InfiniteScrollState, isLoading: boolean): InfiniteScrollState => {
  return { ...state, isLoading };
};
