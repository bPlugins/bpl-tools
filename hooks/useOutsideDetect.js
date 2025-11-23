import { useEffect, useRef } from "react";

export function useOutsideDetect(callback) {
    const ref = useRef(null);
    const btnRef = useRef(null);

    useEffect(() => {
        function handleClick(event) {
            if (ref.current && !ref.current.contains(event.target) && btnRef.current && !btnRef.current.contains(event.target)) {
                callback(event);
            }
        }

        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, [callback]);

    return { ref, btnRef };
}