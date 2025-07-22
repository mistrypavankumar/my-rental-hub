import { House } from "@/lib/constants";
import { createSlice } from "@reduxjs/toolkit";

interface HouseState {
  houses: House[];
  loading: boolean;
  activeHouse?:
    | {
        houseId: string;
        houseName: string;
        defaultPrice: number;
      }
    | undefined;
  error: string | null;
  prefetchHouses?: boolean;
}

const initialState: HouseState = {
  houses: [],
  loading: false,
  error: null,
  activeHouse: undefined,
  prefetchHouses: false,
};

const houseSlice = createSlice({
  name: "house",
  initialState,
  reducers: {
    getAllHousesStart(state) {
      state.loading = true;
      state.error = null;
    },

    getAllHousesSuccess(state, action) {
      state.houses = action.payload;
      state.loading = false;
      state.error = null;
    },

    getAllHousesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    setActiveHouse(state, action) {
      state.activeHouse = action.payload;
    },

    setPrefetchHouses(state, action) {
      state.prefetchHouses = action.payload;
    },
  },
});

export const {
  getAllHousesStart,
  getAllHousesSuccess,
  getAllHousesFailure,
  setActiveHouse,
  setPrefetchHouses,
} = houseSlice.actions;
export default houseSlice.reducer;
