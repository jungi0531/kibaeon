import api from "./axios";

export const checkEmailDuplicated = async (email: string) => {
    const res = await api.get("/check-email", {
        params: { email }
    });

    return res.data as boolean;
}