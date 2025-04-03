type Props = {
  name: string;
  handleDelete: () => void;
};

const ConfirmDelete = ({ name, handleDelete }: Props) => {
  return (
    <dialog id="delete-modal" className="modal">
      <div className="modal-box bg-secondary">
        <h3 className="font-bold text-lg text-white">Last Check!</h3>
        <p className="py-4 text-white">
          Are you sure you want to delete <strong>{name}</strong>?
        </p>
        <div className="flex flex-col gap-5 justify-between items-center md:flex-row">
          <button
            className="bg-red-700 hover:bg-primary py-2 px-5 rounded-md text-white hover:text-black w-full md:w-fit"
            onClick={handleDelete}
          >
            Delete
          </button>
          <form method="dialog" className="w-full md:w-fit">
            {/* if there is a button in form, it will close the modal */}
            <button className="bg-green-700 hover:bg-primary py-2 px-5 rounded-md text-white hover:text-black w-full md:w-fit">
              Cancel
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDelete;
