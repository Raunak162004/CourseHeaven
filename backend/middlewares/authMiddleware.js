import jwt from 'jsonwebtoken';

export const isLoggedIn = (req,res,next) => {
    // console.log(req.cookies); --> this is a object in which one key is token

    // try{
    //     let token = req.cookies.token || "";
    //     console.log("Token found", token ? 'yes' : 'no');


    //     if(!token){
    //         console.log("No token found");
    //         return res.status(401).json({
    //             success: false,
    //             message: "Authentication failed"
    //         })
    //     }

    //     const decoded = jwt.verify(token, process.env.JWT_SECRET)
    //     console.log("Decoded token", decoded);

    //     req.user = decoded

    //     next()

    // }catch(error){
    //     console.log('Error in auth middleware');
    //     return res.status(500).json({
    //         success: false,
    //         message: "Authentication failed"
    //     })
    // }


    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: "Authentication failed"
        });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log(decoded)    ->    {id: '', iat: ''}
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        return res.status(500).json({
            success: false,
            message: "Authentication failed"
        });
    }
}