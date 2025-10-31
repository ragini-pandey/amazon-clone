import Image from "next/image";

import { Search, ShoppingCart, MenuIcon } from "../icons";

const Header = () => {
    return (
        <header>
            <div className="flex items-center bg-amazon_blue p-1 flex-grow">
                <div

                    className="mt-2 flex items-center flex-grow sm:flex-grow-0"
                >
                    <Image
                        width={150}
                        height={40}
                        src="/amazon.png"
                        alt="Amazon logo"
                        className="cursor-pointer p-4"
                    />
                </div>
                <div className="hidden sm:flex items-center rounded-md h-10 flex-grow cursor-pointer bg-yellow-400 hover:bg-yellow-500">
                    <input
                        className="p-2 h-full w-6 flex-grow flex-shrink rounded-l-md focus:outline-none px-4"
                        type="text"
                    />
                    <Search className="h-12 p-4" />
                </div>
                <div className="text-white flex items-center text-xs space-x-6 mx-6 whitespace-nowrap">
                    <div
                        className="link"
                    >
                        <p>Ragini</p>
                        <p className="font-extrabold md:text-sm">Account & List</p>
                    </div>
                    <div className="link">
                        <p>Return</p>
                        <p className="font-extrabold md:text-sm">& Orders</p>
                    </div>
                    <div
                        className="link relative flex items-center"
                    >
                        <span className="absolute top-0 right-0 md:right-10 h-4 w-4 bg-yellow-400 text-center rounded-full font-bold">
                            0
                        </span>
                        <ShoppingCart className="h-10 text-white" />
                        <p className="hidden md:inline mt-2 font-extrabold md:text-sm">
                            Basket
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-3 p-2 pl-6 bg-amazon_blue-light text-white text-sm">
                <p className="link flex items-center">
                    <MenuIcon className="h-6 mr-1" /> All
                </p>
                <p className="link">{`Today's Deals`}</p>
                <p className="link">Prime Video</p>
                <p className="link">Customer Service</p>
                <p className="link hidden lg:inline-flex">Electronics</p>
                <p className="link hidden lg:inline-flex">Foods & Grocery</p>
                <p className="link hidden lg:inline-flex">Prime</p>
                <p className="link hidden lg:inline-flex">Buy Again</p>
                <p className="link hidden lg:inline-flex">Shopper Toolkit</p>
                <p className="link hidden lg:inline-flex">Health & Personal Care</p>
            </div>
        </header>
    );
};

export default Header;
