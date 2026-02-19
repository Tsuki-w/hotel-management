import type { TCabin } from "@/types/cabin";
import { formatCurrency } from "@/utils/helper";
import { TableRow, Img, Cabin, Price, Discount } from "@/ui/Table";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabin } from "@/hooks/useDeleteCabin";
import { HiPencil, HiTrash, HiDuplicate } from "react-icons/hi";
import { useCreateCabin } from "@/hooks/useCreateCabin";
import Modal from "@/ui/Modal";
import ConfirmDelete from "@/ui/ConfirmDelete";
import Menus from "@/ui/Menus";

type IProps = {
  cabin: TCabin;
};

function CabinRow({ cabin }: IProps) {
  const { isPending, mutate } = useDeleteCabin();
  const {
    id: cabinId,
    name,
    maxCapacity,
    regularPrice,
    discount,
    description,
    image,
  } = cabin;
  const { isPending: isDuplicating, mutate: duplicateCabin } = useCreateCabin();

  const handleDuplicate = () => {
    duplicateCabin({
      newCabinData: {
        name: `${name} 的副本`,
        maxCapacity,
        regularPrice,
        discount,
        description,
        image,
      },
    });
  };

  return (
    <>
      <TableRow role="row">
        <Img src={cabin.image || ""}></Img>
        <Cabin>{name}</Cabin>
        <div>最多可容纳 {maxCapacity} 位客人</div>
        <Price>{formatCurrency(Number(regularPrice))}</Price>
        <Discount>{formatCurrency(Number(discount))}</Discount>
        <div>
          <Modal>
            <Menus.Item>
              <Menus.Toggle id={cabinId} />
              <Menus.List id={cabinId}>
                {/* 复制按钮 */}
                <Menus.Button
                  icon={<HiDuplicate />}
                  onClick={handleDuplicate}
                  disabled={isDuplicating}
                >
                  复制
                </Menus.Button>

                {/* 编辑按钮 */}
                <Modal.Open opens="edit">
                  {/* Modal.Open中添加了打开弹窗的函数，编辑逻辑在弹窗中处理，所以此处没有传递打开函数 */}
                  <Menus.Button icon={<HiPencil />}>编辑</Menus.Button>
                </Modal.Open>

                {/* 删除按钮 */}
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>删除</Menus.Button>
                </Modal.Open>
              </Menus.List>
            </Menus.Item>

            {/* 编辑弹窗 */}
            <Modal.Window name="edit">
              <CreateCabinForm cabinToEdit={cabin} />
            </Modal.Window>

            {/* 删除确认弹窗 */}
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="房间"
                disabled={isPending}
                onConfirm={(option) => mutate(cabinId, option)}
              ></ConfirmDelete>
            </Modal.Window>
          </Modal>
        </div>
      </TableRow>
    </>
  );
}

export default CabinRow;
