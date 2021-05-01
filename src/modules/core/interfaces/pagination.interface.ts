export default interface Pagination {
  pageSize: number | null;
  pageNumber: number | null;
  skippedItems?: number;
}
