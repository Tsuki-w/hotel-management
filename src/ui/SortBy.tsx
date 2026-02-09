import Select from "./Select";
import { useSearchParams } from "react-router-dom";

type IProps = {
  options: { value: string; label: string }[];
};

const SortBy = ({ options }: IProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    searchParams.set("sortBy", e.target.value);
    setSearchParams(searchParams);
  };
  const sortBy = searchParams.get("sortBy");

  return (
    <div>
      <Select
        options={options}
        type="white"
        onChange={(e) => handleChange(e)}
        value={sortBy || ""}
      />
    </div>
  );
};

export default SortBy;
