import db from "../models/connection"
import { Request, Response } from "express"
import { BooksData } from "../config/variableHandling"

// Show all books with condition based on case "Shows all existing books and quantities and Books that are being borrowed are not counted"
const getallBooks = async (req: Request, res: Response): Promise<void> => {
    const sql = "SELECT * FROM books WHERE stock <> 0;"
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 15
    const start = (page - 1) * pageSize
    const end = start + pageSize

    db.query(sql, (error: any, result: BooksData[]) => {
        if (error) {
            res.status(500).json({
                message: "Error Fetching Books Data",
                error : error
            })
        } else {
            if(result.length === 0){
                res.status(404).json({
                    message: "Books Data Not Found"
                })
            } else {
                const paginationResult = result.slice(start, end)
                const formattedData = paginationResult.map(data => ({
                    id : data.id,
                    data : {
                            code: data.code,
                            title: data.title,
                            author: data.author,
                            stock: data.stock
                    }
                }))
                res.json({
                    page, 
                    pageSize,
                    totalData: result.length,
                    totalPages: Math.ceil(result.length / pageSize),
                    books : formattedData,
                    message : "Success"
                })
            }
        }
    })
}

const postBooks = async (req: Request, res: Response) : Promise<void> => {
    const { code, title, author, stock } = req.body
    const sql = "INSERT INTO books (code, title, author, stock) VALUES (?,?,?,?)"
    const value = [code, title, author, stock]
    db.query(sql, value, (error:any, result: any) => {
        if(error){
            res.status(500).json({
                message : "Error Inserting Books",
                error : error
            })
        } else {
            res.status(200).json({
                message : "Success",
                book: result.insertId
            })
        }
    })
}

const deleteBooks = async (req: Request, res: Response) : Promise<void> => {
    const sql = 'DELETE FROM books'
    db.query(sql, (error:any, result:any) => {
        if(error) {
            console.error("Error Deleting Books: ", error)
            res.status(500).json({
                message: "Error Deleting Books",
                error : error
            })
        } else {
            const resetAutoIncrement = "ALTER TABLE books AUTO_INCREMENT = 1"
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

const getBooksbyID = async (req: Request, res: Response) : Promise<void> => {
    const bookId = req.params.id
    const sql = "SELECT * FROM books WHERE id = ?"
    db.query(sql, [bookId], (error:any, result:any) => {
        if(error) {
            res.status(500).json({
                message: "Error Fetching Books",
                error : error
            })
        } else {
            if(result.length === 0){
                res.status(404).json({
                    message: "Books Not Found"
                })
            } else {
                res.status(200).json({
                    id: result[0].id,
                    data : {
                        code: result[0].code,
                        title: result[0].title,
                        author: result[0].author,
                        stock: result[0].stock
                    },
                    message: "Success"
                })
            }
        }
    })
}

const deleteBooksbyID = async (req: Request, res: Response) : Promise<void> => {
    const bookId = req.params.id
    const sql = 'DELETE FROM books WHERE id =?'
    db.query(sql,[bookId], (error:any, result:any) => {
        if(error){
            res.status(500).json({
                message: "Error Deleting Books",
                error : error
            })
        } else {
            if(result.length === 0){
                res.status(404).json({
                    message: "Books Not Found"
                })
            } else {
                res.json({
                    message: "Deleted"
                })
            }
        }
    })
}

const putBooksbyID = async (req: Request, res: Response) : Promise<void> => {
    const BookId = req.params.id
    const { code, title, author, stock } = req.body
    const fecthsql = 'SELECT code, title, author, stock FROM books WHERE id = ?'
    db.query(fecthsql,[BookId], (fecthError:any, fecthResult:any) => {
        if(fecthError){
            res.status(500).json({
                messaage: "Error Fetching Books Details",
                error : fecthError
            })
        } else {
            const ExistingValues = fecthResult[0]
            const updatecode = code !== undefined ? code : ExistingValues.code
            const updatetitle = title !== undefined ? title : ExistingValues.title
            const updateauthor = author !== undefined ? author : ExistingValues.author
            const updatestock = stock !== undefined ? stock : ExistingValues.stock
            const sql = "UPDATE books SET code = ? , title = ?, author = ?, stock = ? WHERE id = ?"
            const value = [updatecode, updatetitle, updateauthor, updatestock, BookId]
            db.query(sql, value, (error:any, result:any) => {
                if(error){
                    res.status(500).json({
                        message: "Error Updating Books",
                        error : error
                    })
                } else {
                    if(result.length === 0) {
                        res.status(404).json({
                            message : "Books Not Found"
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
    getallBooks,
    postBooks,
    deleteBooks,
    getBooksbyID,
    deleteBooksbyID,
    putBooksbyID
}