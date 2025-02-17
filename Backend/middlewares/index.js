import jwt from"jsonwebtoken"
export const verifyLogin=async (req,res,next)=>
{
    const authorization = req.headers.authorization;

    try {
        if (authorization) {
            const decodedUser = await jwt.verify(authorization, "MY_SECRET_KEY");
            req.decodedUser = decodedUser;
            next();

        } else {
            return res.status(404).send({ message: "Auth required" })

        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({ message: "Internal error", error: error.message })

    }
}