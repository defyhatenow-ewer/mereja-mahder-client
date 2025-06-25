import { ReactNode, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  totalPages: number;
  currentPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  color?: string;
};

type ButtonProps = {
  currentPage: number;
  totalPages: number;
  label: ReactNode;
  value: "prev" | "next" | number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  color?: string;
};

const PaginationButton = ({
  currentPage,
  totalPages,
  label,
  value,
  setPage,
  color,
}: ButtonProps) => {
  const disabled =
    value == currentPage ||
    (value == "next" && currentPage === totalPages) ||
    (value == "prev" && currentPage === 1) ||
    totalPages === 0;
  const active = currentPage === value;
  const numberPage = value !== "next" && value !== "prev";
  return (
    <button
      value={value}
      disabled={disabled}
      aria-disabled={disabled}
      onClick={() => {
        if (currentPage !== value) {
          if (value === "next") {
            if (currentPage + 1 <= totalPages) {
              setPage(currentPage + 1);
            }
          } else if (value === "prev") {
            if (currentPage - 1 > 0) {
              setPage(currentPage - 1);
            }
          } else {
            setPage(value);
          }
        }
      }}
      className={`${active ? "bg-primary" : numberPage ? "bg-[#EBEBEB]" : "bg-white"} ${disabled ? "" : "hover:bg-secondary hover:!text-white cursor-pointer"} px-3 py-1 ${numberPage ? "md:size-12 rounded-full" : "rounded-md"}`}
      style={{ color: active ? "black" : color }}
    >
      {label}
    </button>
  );
};

type EllipsisProps = {
  color: string;
};
const Ellipsis = ({ color }: EllipsisProps) => (
  <span className={`text-[${color}]`}>...</span>
);

const Pagination = ({
  totalPages,
  currentPage,
  setPage,
  color = "#0B1215",
}: Props) => {
  const { t } = useTranslation();
  const [pageList, setPageList] = useState<number[]>([]);

  useEffect(() => {
    const arr = [];
    let j = totalPages;
    while (j > 0) {
      arr.push(j);
      j -= 1;
    }
    const reversedArr = arr.reverse();
    const cleanedArr = reversedArr.map((pg) => {
      if (
        pg === 1 ||
        pg === totalPages ||
        pg === currentPage ||
        (pg === currentPage - 1 && pg !== 1) ||
        (pg === currentPage + 1 && pg !== totalPages)
      ) {
        return pg;
      }
      return -1;
    });
    const collapsedArr = cleanedArr.filter(
      (pg, index, arr) => pg !== -1 || (pg === -1 && arr[index - 1] !== -1)
    );
    setPageList(collapsedArr);
  }, [currentPage, totalPages]);

  return (
    <div className="w-full flex flex-wrap justify-center items-center gap-4">
      <PaginationButton
        label={<span>{t("previous")}</span>}
        value="prev"
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setPage}
        color={color}
      />
      {pageList.map((pageNumber) => {
        if (pageNumber !== -1) {
          return (
            <PaginationButton
              key={pageNumber}
              label={pageNumber}
              value={pageNumber}
              currentPage={currentPage}
              totalPages={totalPages}
              setPage={setPage}
              color={color}
            />
          );
        }
        return <Ellipsis color={color} />;
      })}
      <PaginationButton
        label={<span>{t("next")}</span>}
        value="next"
        currentPage={currentPage}
        totalPages={totalPages}
        setPage={setPage}
        color={color}
      />
    </div>
  );
};

export default Pagination;
