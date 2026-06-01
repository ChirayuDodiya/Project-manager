export const formatDate = (dateStr: string | null) => {
  if (!dateStr) return 'N/A';
  return dateStr.split('T')[0];
};
