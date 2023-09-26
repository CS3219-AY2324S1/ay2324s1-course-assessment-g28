export default function QuestionWindow(props) {

  const tags = ["Arrays", "Dynamic Programming", "Heap", "Binary Search tree"];

  return (
    <div className="h-full w-full flex flex-col bg-white p-5 overflow-auto rounded-xl">
      <div className="font-bold">
        1. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut
      </div>
      <div className="py-5 gap-y-2 gap-x-2 w-full flex-wrap flex flex-row items-center">
        <div className="text-green-500 font-bold mr-2">
          Easy
        </div>
        {
          tags.map(e => (
            <div className="text-sm px-2 py-1 border-2 rounded-xl border-blue-300 border-solid">
              {e}
            </div>
          ))
        }
      </div>
      <div className="w-full grow">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
        aliquip ex ea commodo consequat.
      </div> 
    </div>
  )
}
