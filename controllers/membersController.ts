import db from "../models/connection"
import { Request, Response } from "express"
import { MembersData } from "../config/variableHandling"

// // Show all members with condition based on case "Shows all existing members and The number of books being borrowed by each member"
const getallMembers = async (req: Request, res: Response): Promise<void> => {
    const sql = `SELECT m.id, m.code, m.name, COUNT(b.id) AS borrowed_book
                 FROM members m
                 LEFT JOIN borrow b ON m.id = b.member_id
                 GROUP BY m.id, m.code, m.name`
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 15
    const start = (page - 1) * pageSize
    const end = start + pageSize

    db.query(sql, (error: any, result: MembersData[]) => {
        if (error) {
            res.status(500).json({
                message: "Error Fetching Members Data",
                error : error
            })
        } else {
            if(result.length === 0){
                res.status(404).json({
                    message: "Members Data Not Found"
                })
            } else {
                const paginationResult = result.slice(start, end)
                const formattedData = paginationResult.map(data => ({
                    id : data.id,
                    data : {
                            code: data.code,
                            name : data.name,
                            borrowed_book : data.borrowed_book
                    }
                }))
                res.json({
                    page, 
                    pageSize,
                    totalData: result.length,
                    totalPages: Math.ceil(result.length / pageSize),
                    members : formattedData,
                    message : "Success"
                })
            }
        }
    })
}

const postMembers = async (req: Request, res: Response) : Promise<void> => {
    const { code, name} = req.body
    const sql = "INSERT INTO members (code, name) VALUES (?,?)"
    const value = [code, name]
    db.query(sql, value, (error:any, result: any) => {
        if(error){
            res.status(500).json({
                message : "Error Inserting Members",
                error : error
            })
        } else {
            res.status(200).json({
                message : "Success",
                Member: result.insertId
            })
        }
    })
}

const deleteMembers = async (req: Request, res: Response) : Promise<void> => {
    const sql = 'DELETE FROM members'
    db.query(sql, (error:any, result:any) => {
        if(error) {
            console.error("Error Deleting Members: ", error);
            res.status(500).json({
                message: "Error Deleting Members",
                error : error
            })
        } else {
            const resetAutoIncrement = "ALTER TABLE members AUTO_INCREMENT = 1"
            db.query(resetAutoIncrement, (error:any, result:any) => {
                if(error){
                    console.error("Error resetting auto-increment counter: ", error)
                    res.status(500).json({
                        message: "Error resetting auto-increment counter",
                        error : error
                    })
                } else {
                    res.json({
                        message: "deleted"
                    })
                }
            })
        }
    })
}

const getMembersbyID = async (req: Request, res: Response) : Promise<void> => {
    const MemberId = req.params.id
    const sql = `SELECT m.id, m.code, m.name, COUNT(b.id) AS borrowed_book
                 FROM members m
                 LEFT JOIN borrow b ON m.id = b.member_id
                 WHERE m.id = ?`
    db.query(sql, [MemberId], (error:any, result:any) => {
        if(error) {
            res.status(500).json({
                message: "Error Fetching Members",
                error : error
            })
        } else {
            if(result[0].id === null){
                res.status(404).json({
                    message: "Members Not Found"
                })
            } else {
                res.status(200).json({
                    id: result[0].id,
                    data : {
                        code: result[0].code,
                        name: result[0].name,
                        borrowerd_book : result[0].borrowed_book
                    },
                    message: "Success"
                })
            }
        }
    })
}

const deleteMembersbyID = async (req: Request, res: Response) : Promise<void> => {
    const MemberId = req.params.id
    const sql = 'DELETE FROM members WHERE id =?'
    db.query(sql,[MemberId], (error:any, result:any) => {
        if(error){
            res.status(500).json({
                message: "Error Deleting Members",
                error : error
            })
        } else {
            if(result.length === 0){
                res.status(404).json({
                    message: "Members Not Found"
                })
            } else {
                res.json({
                    message: "Deleted"
                })
            }
        }
    })
}

const putMembersbyID = async (req: Request, res: Response) : Promise<void> => {
    const MemberId = req.params.id
    const { code, name} = req.body
    const fecthsql = 'SELECT code, name FROM members WHERE id = ?'
    db.query(fecthsql,[MemberId], (fecthError:any, fecthResult:any) => {
        if(fecthError){
            res.status(500).json({
                messaage: "Error Fetching Members Details",
                error : fecthError
            })
        } else {
            const ExistingValues = fecthResult[0]
            const updatecode = code !== undefined ? code : ExistingValues.code
            const updatename = name !== undefined ? name : ExistingValues.name
            const sql = "UPDATE members SET code = ? , name = ? WHERE id = ?"
            const value = [updatecode, updatename, MemberId]
            db.query(sql, value, (error:any, result:any) => {
                if(error){
                    res.status(500).json({
                        message: "Error Updating Members",
                        error : error
                    })
                } else {
                    if(result.length === 0) {
                        res.status(404).json({
                            message : "Members Not Found"
                        })
                    } else {
                        res.json({
                            message: "Update"
                        })
                    }
                }
            })
        }
    })
}

export default {
    getallMembers,
    postMembers,
    deleteMembers,
    getMembersbyID,
    deleteMembersbyID,
    putMembersbyID
}