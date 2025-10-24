import axios from "axios";


const Axiosinstance = axios.create({
    baseURL: "http://localhost:5000/api/",
});

export default Axiosinstance;