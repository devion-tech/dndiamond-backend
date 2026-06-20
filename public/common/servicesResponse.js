export const commonSendResponse = async (data, obj) => {
    if (data || obj) {
        return data && obj ? { data, obj } : data
    } else {
        return false
    }
} 