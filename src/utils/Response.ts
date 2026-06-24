export const formatResponse = ({ message, data = null }: { message: string; data?: any }) => {
    return {
        success: true,
        message,
        ...(data && { data })
    };
};