import { MemberProps } from "@/lib/constants";
import {
  deleteMemberById,
  getMembersByHouseId,
} from "@/services/houseServices";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const MemberRecord = ({
  activeHouse,
  setFormData,
  setFormMode,
}: {
  activeHouse?: { houseName: string; houseId: string };
  setFormData: React.Dispatch<React.SetStateAction<MemberProps>>;
  setFormMode: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [memberData, setMemberData] = useState<MemberProps[]>([]);
  const [undo, setUndo] = useState<string>("");

  useEffect(() => {
    const fetchMembers = async () => {
      if (!activeHouse) return;
      try {
        const response = await getMembersByHouseId(activeHouse.houseId);
        if (response.status !== 200) {
          throw new Error("Failed to fetch members");
        }

        const { members } = response.data;
        console.log("Fetched Members:", members);
        setMemberData(members);
      } catch (error) {
        console.error("Error fetching members:", error);
      }
    };

    fetchMembers();
  }, [activeHouse]);

  const handleDeleteMember = async (memberId: string) => {
    try {
      const response = await deleteMemberById(memberId);
      if (response.status !== 200) {
        throw new Error("Failed to delete member");
      }

      setMemberData((prev) => prev.filter((member) => member._id !== memberId));
      toast.success("Member deleted successfully");
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  const handleEditMember = (memberId: string) => {
    const member = memberData.find((m) => m._id === memberId);
    if (member) {
      if (undo) {
        setUndo("");
        setFormMode("create");
        setFormData({
          _id: "",
          name: "",
          email: "",
          phone: "",
          houseId: activeHouse?.houseId || "",
          role: "tenant",
          stayInSharedRoom: false,
        });
        return;
      }

      setFormData({
        _id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        houseId: activeHouse?.houseId || "",
        role: member.role,
        stayInSharedRoom: member.stayInSharedRoom,
      });

      setFormMode("edit");
      setUndo(member._id!);
    }
  };

  if (!activeHouse) {
    return (
      <div className="text-center text-gray-500">No active house selected</div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Members of {activeHouse?.houseName || "Unknown House"} -{" "}
          {memberData.length}
        </h1>
      </div>

      <div className="w-full md:w-[90%] mx-auto flex flex-col gap-4 h-dvh overflow-y-auto">
        {memberData.map((member, index) => (
          <div
            key={index}
            className="border-2 border-gray-300 rounded-md p-3 bg-white shadow-lg flex justify-between items-center"
          >
            <div>
              <h1 className="text-xl font-bold">{member.name}</h1>
              <p className="text-gray-400 font-semibold">
                {member.joinedAt?.toString().split("T")[0]}
              </p>
            </div>
            <div>
              <div className="flex flex-col items-end justify-end">
                <h2 className="font-bold text-gray-400 capitalize">
                  {member.role} |{" "}
                  {member.stayInSharedRoom ? "Shared room" : "Single room"}
                </h2>
                <div className="flex gap-3 text-gray-500">
                  <p
                    className="hover:underline cursor-pointer text-blue-600 font-medium"
                    onClick={() => handleEditMember(member._id!)}
                  >
                    {undo === member._id ? "Undo" : "Edit"}
                  </p>{" "}
                  |{" "}
                  <p
                    className="hover:underline cursor-pointer text-red-500 font-medium"
                    onClick={() => handleDeleteMember(member._id!)}
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

export default MemberRecord;
