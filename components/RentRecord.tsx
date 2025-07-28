import { RentProps } from "@/lib/constants";
import { convertCentsToDollars, showErrorMessage } from "@/lib/utils";
import { deleteRentById, getRentsByHouseId } from "@/services/rentServices";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalToGeneratePayment from "./ModalToGeneratePayment";
import Image from "next/image";
import { noRecordImg } from "@/public/assets";

const RentRecord = ({
  activeHouse,
  setFormData,
  setFormMode,
}: {
  activeHouse?: { houseName: string; houseId: string; defaultPrice: number };
  setFormData: React.Dispatch<React.SetStateAction<RentProps>>;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [rentData, setRentData] = React.useState<RentProps[]>([]);
  const [undo, setUndo] = useState<string>("");
  const [rentId, setRentId] = useState<string>("");
  const [monthRentData, setMonthRentData] = useState<RentProps | null>(null);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);

  const [openModel, setOpenModel] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const fetchRents = async () => {
      if (!activeHouse) return;

      try {
        const response = await getRentsByHouseId(activeHouse.houseId);

        if (response.status !== 200) {
          throw new Error("Failed to fetch rent records");
        }

        setRentData(response.data.rents);
      } catch (error) {
        console.error("Error fetching rent records:", error);
      } finally {
        timeout = setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchRents();

    return () => {
      clearTimeout(timeout);
    };
  }, [activeHouse]);

  const handleEditMember = (rentId: string) => {
    const rent = rentData.find((r) => r._id === rentId);

    if (rent) {
      if (undo) {
        setUndo("");
        setFormMode("create");
        setFormData({
          _id: rent._id,
          houseId: activeHouse?.houseId || "",
          month: new Date().toISOString().split("T")[0],
          houseRent: convertCentsToDollars(activeHouse!.defaultPrice) || 0,
          gas: 0,
          electricity: 0,
          internet: 0,
          water: 0,
          totalRent: 0,
        });
        return;
      }

      setFormData({
        _id: rent._id,
        houseId: activeHouse?.houseId || "",
        month: new Date(rent.month).toISOString().split("T")[0],
        houseRent: rent.houseRent,
        gas: rent.gas,
        electricity: rent.electricity,
        internet: rent.internet,
        water: rent.water,
        totalRent: rent.totalRent,
      });
      setFormMode("edit");
      setUndo(rent._id!);
    }
  };

  const handleDeleteMember = async (rentId: string) => {
    try {
      const response = await deleteRentById(rentId);
      if (response.status !== 200) {
        throw new Error("Failed to delete rent record");
      }

      setRentData((prev) => prev.filter((rent) => rent._id !== rentId));
      setDeleteConfirmModal(false);
      setRentId("");
      toast.success("Rent record deleted successfully");
    } catch (error) {
      showErrorMessage(error as Error);
    }
  };

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="text-center text-gray-400 md:h-[80dvh] grid place-items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (rentData.length === 0) {
    return (
      <div className="text-center text-gray-400">
        <div>
          <div className="w-full flex items-center justify-center">
            <Image
              src={noRecordImg}
              alt="No data found"
              width={500}
              loading="lazy"
              decoding="async"
              data-nimg="1"
            />
          </div>
          <h2 className="text-3xl">No Rent Records Found</h2>
          <p className="text-gray-400 mt-2">
            Add rent records to manage payments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Rent Records of {activeHouse?.houseName || "Unknown House"} -{" "}
          {rentData.length}
        </h1>
      </div>

      {openModel && (
        <ModalToGeneratePayment
          rentData={monthRentData}
          month={new Date().toLocaleString("default", { month: "long" })}
          setOpenModel={setOpenModel}
          activeHouse={activeHouse}
          rentId={rentId}
          isRentGenerated={monthRentData?.isRentGenerated || false}
        />
      )}

      {deleteConfirmModal && (
        <div className="fixed top-0 left-0 inset-0 w-full h-full backdrop-blur-sm bg-gray-900/50 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-lg font-bold">Delete Rent Record</h2>
            <p className="text-gray-600 mb-7">
              Are you sure you want to delete this rent record?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-primary hover:bg-primary-light transition-colors duration-300 text-white cursor-pointer px-4 py-2 rounded-md mr-2"
                onClick={() => setDeleteConfirmModal(false)}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMember(rentId)}
                className="bg-red-600 hover:bg-red-700 transition-colors duration-300 text-white cursor-pointer px-4 py-2 rounded-md"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full md:w-[90%] mx-auto flex flex-col h-dvh overflow-y-auto">
        {rentData.map((rent, index) => {
          const createdAt = rent.month?.toString().split("T")[0];
          return (
            <div
              key={index}
              className="border-2 border-gray-300 rounded-md p-3 mb-5 bg-white shadow-lg flex justify-between items-center"
            >
              <div>
                <h1 className="text-xl font-bold">
                  {new Date(rent.month).toLocaleString("default", {
                    month: "long",
                  })}{" "}
                </h1>
                <p className="text-gray-400 font-semibold">{createdAt}</p>
              </div>
              <div>
                <div className="flex flex-col items-end justify-end">
                  <h2 className="font-bold text-green-600 capitalize text-xl">
                    ${rent.totalRent}
                  </h2>
                  <div className="flex gap-3 text-gray-500">
                    {new Date(rent.month).getMonth() + 1 === currentMonth &&
                    new Date(rent.month).getFullYear() === currentYear &&
                    !rent.isRentGenerated ? (
                      <>
                        <p
                          className="hover:underline cursor-pointer text-blue-600 font-medium"
                          onClick={() => handleEditMember(rent._id!)}
                        >
                          {undo === rent._id ? "Undo" : "Edit"}
                        </p>{" "}
                        |{" "}
                      </>
                    ) : null}
                    <Link
                      href={"#"}
                      onClick={() => {
                        setOpenModel(true);
                        setRentId(rent._id!);
                        setMonthRentData(rent);
                      }}
                      className="hover:underline text-nowrap cursor-pointer text-blue-600 font-medium"
                    >
                      Manage Rent
                    </Link>{" "}
                    {new Date(rent.month).getMonth() + 1 === currentMonth &&
                    new Date(rent.month).getFullYear() === currentYear ? (
                      <>
                        |{" "}
                        <p
                          className="hover:underline cursor-pointer text-red-600 font-medium"
                          onClick={() => {
                            setDeleteConfirmModal(true);
                            setRentId(rent._id!);
                          }}
                        >
                          Delete
                        </p>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default RentRecord;
