import db from "../models/connection"
import { Request, Response } from "express"
import { BorrowedData } from "../config/variableHandling"


const getallBorrow = async (req: Request, res: Response): Promise<void> => {
    const sql = `SELECT b.*, bo.code, bo.title, bo.author, m.name 
                 FROM borrow b 
                 LEFT JOIN books bo ON b.book_id = bo.id 
                 LEFT JOIN members m ON b.member_id = m.id`
    const page = parseInt(req.query.page as string) || 1
    const pageSize = parseInt(req.query.pageSize as string) || 15
    const start = (page - 1) * pageSize
    const end = start + pageSize

    db.query(sql, (error: any, result: BorrowedData[]) => {
        if (error) {
            res.status(500).json({
                message: "Error Fetching Borrow Data",
                error : error
            })
        } else {
            if(result.length === 0){
                res.status(404).json({
                    message: "Borrow Data Not Found"
                })
            } else {
                const paginationResult = result.slice(start, end)
                const formattedData = paginationResult.map(data => ({
                    id : data.id,
                    data : {
                            book_code : data.code,
                            book_title : data.title,
                            book_author : data.author,
                            member_name : data.name,
                            borrow_date : data.borrow_date,
                            returned : (parseInt(data.isreturn) === 1) ? "returned" : "not returned",
                            return_date : data.return_date,
                            total_days : data.total_days + " days"
                    }
                }))
                res.json({
                    page, 
                    pageSize,
                    totalData: result.length,
                    totalPages: Math.ceil(result.length / pageSize),
                    Borrow : formattedData,
                    message : "Success"
                })
            }
        }
    })
}

const postBorrow = async (req: Request, res: Response): Promise<void> => {
    const { member_code, book_code } = req.body
    const creationDate = new Date()
    const borrow_date = creationDate.toISOString().slice(0, 10)

    // GET member_id based on member_code
    const memberidsql = "SELECT id FROM members WHERE code = ?"
    db.query(memberidsql, [member_code], (err:any, idmember: any) => {
        if (err) {
            console.error("Error querying member:", err)
            return res.status(500).json({ message: "Database query error" })
        }

        if (idmember.length === 0) {
            return res.status(404).json({ message: "Member Not Found" })
        }

        // GET book_id based on book_code
        const bookidsql = "SELECT id FROM books WHERE code = ?"
        db.query(bookidsql, [book_code], (err:any, idbook: any) => {
            if (err) {
                console.error("Error querying book:", err)
                return res.status(500).json({ message: "Database query error" })
            }

            if (idbook.length === 0) {
                return res.status(404).json({ message: "Book Not Found" })
            }
            // Check if the member is penalized, to answer case "Member is currently not being penalized"
            const penaltysql = "SELECT ispenalty FROM members WHERE code = ?"
            db.query(penaltysql, [member_code], (err:any, ispenaltyresult:any) => {
                if(err){
                    console.error("Error counting borrowed books:", err)
                    return res.status(500).json({ message: "Database query error" })
                }
                if (ispenaltyresult[0].ispenalty === 1) {
                    return res.status(400).json({ message: "Member is penalized" })
                }
                // Check if the member has borrowed more than 2 books, to answer case "Members may not borrow more than 2 books"
                const membersql = "SELECT COUNT(*) AS total FROM borrow WHERE member_id = ?"
                db.query(membersql, [idmember[0].id], (err:any, memberResult: any) => {
                    if (err) {
                        console.error("Error counting borrowed books:", err)
                        return res.status(500).json({ message: "Database query error" })
                    }

                    if (memberResult[0].total >= 2) {
                        return res.status(400).json({ message: "Already Borrowed 2 Books" })
                    }

                    // Check if the book is available, to answer case "Borrowed books are not borrowed by other members"
                    const booksql = "SELECT stock FROM books WHERE code = ?"
                    db.query(booksql, [book_code], (err:any, bookResult: any) => {
                        if (err) {
                            console.error("Error checking book stock:", err)
                            return res.status(500).json({ message: "Database query error" })
                        }

                        if (bookResult.length === 0) {
                            return res.status(404).json({ message: "Book Not Found" })
                        }

                        // Check book can borrwed or not, because for each book stock is 1, then isborrowed based on stock
                        if (bookResult[0].stock <= 0) {
                            return res.status(404).json({ message: "Out of Stock / Being Borrowed" })
                        }

                        // Update stock of the book
                        const updatestock = bookResult[0].stock - 1
                        const stocksql = "UPDATE books SET stock = ? WHERE code = ?"
                        db.query(stocksql, [updatestock, book_code], (err) => {
                            if (err) {
                                console.error("Error updating book stock:", err)
                                return res.status(500).json({ message: "Database update error" })
                            }

                            // Insert the borrow record into the borrow table
                            const borrowsql = "INSERT INTO borrow (member_id, book_id, borrow_date) VALUES (?, ?, ?)"
                            db.query(borrowsql, [idmember[0].id, idbook[0].id, borrow_date], (err:any, result:any) => {
                                if (err) {
                                    console.error("Error inserting borrowed data:", err)
                                    return res.status(500).json({ message: "Error Inserting Borrowed Data", error: err })
                                }

                                res.status(200).json({ 
                                    message: "Book borrowed successfully.",
                                    borrow: result.insertId
                                })
                            });
                        });
                    });
                });
            })
        });
    });
}

const deleteBorrow = async (req: Request, res: Response) : Promise<void> => {
    const sql = 'DELETE FROM borrow'
    db.query(sql, (error:any, result:any) => {
        if(error) {
            console.error("Error Deleting Borrow: ", error)
            res.status(500).json({
                message: "Error Deleting Borrow",
                error : error
            })
        } else {
            const resetAutoIncrement = "ALTER TABLE borrow AUTO_INCREMENT = 1"
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


export default {
    getallBorrow,
    postBorrow,
    deleteBorrow
}
