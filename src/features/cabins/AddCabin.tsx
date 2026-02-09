import Button from "@/ui/Button";
import CreateCabinForm from "@/features/cabins/CreateCabinForm";
import Modal from "@/ui/Modal";

const AddCabin = () => {
  return (
    <>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button size="full">添加新房间</Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </>
  );
};

export default AddCabin;
