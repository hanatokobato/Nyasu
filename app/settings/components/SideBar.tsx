import Link from 'next/link';

const SideBar = () => {
  return (
    <div className="relative bg-white dark:bg-gray-800">
      <div className="flex flex-col sm:flex-row sm:justify-around">
        <div className="h-screen w-72">
          <nav className="mt-10 px-6 ">
            <Link
              href="/settings/decks"
              className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg "
            >
              Decks
            </Link>
            <Link
              href="#"
              className="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg "
            >
              Cards
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
