import { Pagination } from "@nextui-org/react";
import { useAttemptsTableContext } from "../AttemptsTableContext";

const TablePagination = () => {
  const { totalPages, page, setPage } = useAttemptsTableContext();

  return (
    <div className="py-2 px-2 flex items-center justify-between">
      <Pagination
        isCompact
        showControls
        showShadow
        color="secondary"
        page={page}
        total={totalPages}
        onChange={setPage}
        disableAnimation
      />
    </div>
  );
};

export default TablePagination;
