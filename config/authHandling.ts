import { Request, Response, NextFunction } from 'express'

const secretKey: string | undefined = process.env.TOKENSECRET

const checkAuthentication = (req: Request, res: Response, next : NextFunction): void | Response => {
    const authHeader: string | undefined = req.header('Authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized Bearer' })
    }

    const token: string = authHeader.slice(7)

    if (token === null || token === 'null') {
        return res.status(403).json({ message: 'Token is null' })
    }

    try {
        if (token === secretKey) {
            next() 
        } else {
            return res.status(403).json({ message: 'Forbidden Invalid token' })
        }
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
}

const checkAuthorization = (req: Request, res: Response, next : NextFunction): void | Response => {
    const userRole = req.headers['x-user-role']  

    if (userRole === 'admin' || userRole === 'librarian') {
        next()  
    } else {
        return res.status(403).json({ message: 'Forbidden Role' })
    }
}

const authenticateAndAuthorize = (req: Request, res: Response, next: NextFunction) => {
    checkAuthentication(req, res, (err: any) => {
        if (err) {
            return  
        }
    checkAuthorization(req, res, next)  
})
};

export default authenticateAndAuthorize;
