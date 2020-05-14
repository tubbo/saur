import Loader from "./loader.js";

const loader = new Loader();
const require = loader.require.bind(loader);

export default require;
