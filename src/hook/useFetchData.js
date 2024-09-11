import { useEffect } from "react"
import { useDispatch } from "react-redux"

const useFetchData = (req, dispatchfunc) => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(dispatchfunc(req));
    }, [])
}

export default useFetchData;