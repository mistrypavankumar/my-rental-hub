import { RentProps } from "@/lib/constants";
import { convertCentsToDollars, showErrorMessage } from "@/lib/utils";
import { deleteRentById, getRentsByHouseId } from "@/services/houseServices";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ModalToGeneratePayment from "./ModalToGeneratePayment";

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

  const [openModel, setOpenModel] = useState(false);

  useEffect(() => {
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
      }
    };

    fetchRents();
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
      toast.success("Rent record deleted successfully");
    } catch (error) {
      showErrorMessage(error as Error);
    }
  };

  return (
    <>
      {openModel && (
        <ModalToGeneratePayment
          rentData={monthRentData}
          month={new Date().toLocaleString("default", { month: "long" })}
          setOpenModel={setOpenModel}
          activeHouse={activeHouse}
          rentId={rentId}
        />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Rent Records of {activeHouse?.houseName || "Unknown House"} -{" "}
          {rentData.length}
        </h1>
      </div>

      <div className="w-full md:w-[90%] mx-auto flex flex-col gap-4 h-dvh overflow-y-auto">
        {rentData.map((rent, index) => (
          <div
            key={index}
            className="border-2 border-gray-300 rounded-md p-3 bg-white shadow-lg flex justify-between items-center"
          >
            <div>
              <h1 className="text-xl font-bold">
                {new Date(rent.month).toLocaleString("default", {
                  month: "long",
                })}{" "}
              </h1>
              <p className="text-gray-400 font-semibold">
                {rent.createdAt?.toString().split("T")[0]}
              </p>
            </div>
            <div>
              <div className="flex flex-col items-end justify-end">
                <h2 className="font-bold text-green-600 capitalize text-xl">
                  ${rent.totalRent}
                </h2>
                <div className="flex gap-3 text-gray-500">
                  <p
                    className="hover:underline cursor-pointer text-blue-600 font-medium"
                    onClick={() => handleEditMember(rent._id!)}
                  >
                    {undo === rent._id ? "Undo" : "Edit"}
                  </p>{" "}
                  |{" "}
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
                  |
                  <p
                    className="hover:underline cursor-pointer text-red-500 font-medium"
                    onClick={() => handleDeleteMember(rent._id!)}
                  >
                    Delete
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default RentRecord;
