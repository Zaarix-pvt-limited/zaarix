import SideBar from "../Components/SideBar"
import { Outlet } from "react-router-dom";


const MainPageLayout = () => {








  return (
    <div className="h-screen overflow-hidden flex py-4 pr-4 w-screen bg-gray-100 dark:bg-[#171e2e]">
      <div className=" w-80 px-5 h-full">
        <SideBar />
      </div>
      <div className="flex gap-2 w-full">

        <div className="bg-white dark:bg-[#2b3450] rounded-sm w-full h-full overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default MainPageLayout