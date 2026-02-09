import CabinTable from "@/features/cabins/CabinTable";
import Row from "@/ui/Row";
import Heading from "@/ui/Heading";
import AddCabin from "@/features/cabins/AddCabin";
import CabinTableOperation from "@/features/cabins/CabinTableOperation";

const Cabins = () => {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">所有房间</Heading>
        <CabinTableOperation />
      </Row>
      <Row type="vertical">
        <CabinTable />
        <AddCabin />
      </Row>
    </>
  );
};

export default Cabins;
