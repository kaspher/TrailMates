const NoPage = () => {
    return (
        <div className="relative w-screen h-screen overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-full h-1/3 bg-404-forest bg-cover bg-bottom bg-no-repeat" />
            <div className="absolute top-0 left-0 w-full h-2/3 bg-404-sky bg-cover bg-no-repeat" />
            <div className="absolute top-1/4 w-full text-center font-poppins">
                <h1 className="text-9xl font-bold text-gray-800">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mt-4">Ups! Wygląda na to że zabłądziłeś!</h2>
            </div>
        </div>
    );
};

export default NoPage;
