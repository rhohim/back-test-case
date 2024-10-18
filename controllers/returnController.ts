import db from "../models/connection"
import { Request, Response } from "express"

const postReturn = async (req:Request, res:Response): Promise<void> => {
    const {member_code, book_code} = req.body
    const creationDate = new Date()
    const return_Date = creationDate.toISOString().slice(0,10)
    // const return_Date = "2024-11-20"

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

            // Check book that has borrowed, to answer case "The returned book is a book that the member has borrowed"
            const checksql = "SELECT borrow_date FROM borrow WHERE book_id = ?"
            db.query(checksql,[idbook[0].id], (err:any, checkdataresult:any) => {
                if (err) {
                    console.error("Error checking book stock:", err)
                    return res.status(500).json({ message: "Database query error" })
                }
                if (checkdataresult.length === 0) {
                    return res.status(404).json({ message: "Data Not Found" })
                } else {
                    //Check return date, to answer case "If the book is returned after more than 7 days, the member will be subject to a penalty. Member with penalty cannot able to borrow the book for 3 days"
                    const start = new Date(checkdataresult[0].borrow_date)
                    const end = new Date(return_Date)
                    const differenceInTime = end.getTime() - start.getTime()
                    const differenceInDays = differenceInTime / (1000 * 3600 * 24)
                    const returnsql = "UPDATE borrow SET member_id = ?, book_id = ?, borrow_date = ?, isreturn = ?, return_date = ?, total_days = ? WHERE book_id = ?"
                    console.log(idmember[0].id, idbook[0].id,checkdataresult[0].borrow_date, 1, return_Date, differenceInDays, idbook[0].id)
                    const value = [idmember[0].id, idbook[0].id,checkdataresult[0].borrow_date, 1, return_Date, differenceInDays, idbook[0].id]
                    //Update penalized member
                    let penalty = 0
                    if (differenceInDays > 7){
                        penalty = 1
                    }
                    const penaltysql = "UPDATE members SET ispenalty = ? WHERE code = ?"
                    db.query(penaltysql,[penalty,member_code], (err:any)=> {
                        if (err) {
                            console.error("Error inserting return data:", err)
                            return res.status(500).json({ message: "Error Inserting return Data", error: err })
                        }
                        db.query(returnsql, value, (err:any) => {
                            if (err) {
                                console.error("Error inserting return data:", err)
                                return res.status(500).json({ message: "Error Inserting return Data", error: err })
                            }
                            // Update Stock of the book
                            const booksql = "SELECT stock FROM books WHERE code = ?"
                            db.query(booksql, [book_code], (err:any, bookResult: any) => {
                                if (err){
                                    console.error("Error checking book stock:", err)
                                    return res.status(500).json({ message: "Database query error" })
                                }
                                if (bookResult.length === 0) {
                                    return res.status(404).json({ message: "Book Not Found" })
                                }
                                
                                const updatestock = bookResult[0].stock + 1
                                const stocksql = "UPDATE books SET stock = ? WHERE code = ?"
                                db.query(stocksql, [updatestock, book_code], (err) => {
                                    if (err) {
                                        console.error("Error updating book stock:", err)
                                        return res.status(500).json({ message: "Database update error" })
                                    }
                                    
                                    res.status(200).json({ 
                                        message: "Book returned: " + differenceInDays + " days"
                                    })
                                })
                            })
                        })
                    })
                }
                
            })
        })
    })
}

export default {
    postReturn
}